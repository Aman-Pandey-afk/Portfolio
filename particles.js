import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { scene, camera, getViewportBounds } from './scene.js';

let particlesMesh;
let linesMesh;
const particlesCount = 5000;
const maxDistance = 5;
const RIPPLE_RADIUS = 15;
const RIPPLE_FORCE = 2.0;
const COLOR_SHIFT_SPEED = 0.02;

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let rippleCenter = new THREE.Vector3();
let rippleStrength = 0;

export function handleMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(particlesMesh);
    
    if (intersects.length > 0) {
        rippleCenter.copy(intersects[0].point);
        rippleStrength = 1.0;
    }
}

export function initParticleSystem() {
    const bounds = getViewportBounds();
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * bounds.width * 2;
        posArray[i + 1] = (Math.random() - 0.5) * bounds.height * 2;
        posArray[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Initialize particles with blue-purple palette
    const colors = new Float32Array(particlesCount * 3);
    for(let i = 0; i < colors.length; i += 3) {
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.008,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
    });
    
    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create lines geometry for connections
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.2
    });
    
    linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);
}

export function updateParticles() {
    const positions = particlesMesh.geometry.attributes.position.array;
    const colors = particlesMesh.geometry.attributes.color.array;
    const linePositions = [];
    
    // Update particle positions and colors
    if (rippleStrength > 0) {
        for(let i = 0; i < positions.length; i += 3) {
            const particlePos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );
            
            const distance = particlePos.distanceTo(rippleCenter);
            if (distance < RIPPLE_RADIUS) {
                const force = (1 - distance / RIPPLE_RADIUS) * rippleStrength * RIPPLE_FORCE;
                const direction = particlePos.sub(rippleCenter).normalize();
                
                positions[i] += direction.x * force;
                positions[i + 1] += direction.y * force;
                positions[i + 2] += direction.z * force;
                
                // Dynamic color change
                const hue = (Math.sin(Date.now() * COLOR_SHIFT_SPEED) + 1) / 2;
                const color = new THREE.Color();
                color.setHSL(hue, 0.8, 0.5);
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
        }
        
        rippleStrength *= 0.92;
        particlesMesh.geometry.attributes.position.needsUpdate = true;
        particlesMesh.geometry.attributes.color.needsUpdate = true;
    }
    
    // Update connections
    for(let i = 0; i < positions.length; i += 3) {
        const x1 = positions[i];
        const y1 = positions[i + 1];
        const z1 = positions[i + 2];
        
        for(let j = i + 3; j < positions.length; j += 3) {
            const x2 = positions[j];
            const y2 = positions[j + 1];
            const z2 = positions[j + 2];
            
            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) +
                Math.pow(y2 - y1, 2) +
                Math.pow(z2 - z1, 2)
            );
            
            if(distance < maxDistance) {
                linePositions.push(x1, y1, z1, x2, y2, z2);
            }
        }
    }
    
    // Update lines geometry
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesMesh.geometry.dispose();
    linesMesh.geometry = linesGeometry;
    
    // Rotate particles
    particlesMesh.rotation.y += 0.0005;
}

export function handleResize() {
    const bounds = getViewportBounds();
    const positions = particlesMesh.geometry.attributes.position.array;
    
    for(let i = 0; i < positions.length; i += 3) {
        positions[i] = THREE.MathUtils.clamp(
            positions[i],
            -bounds.width,
            bounds.width
        );
        positions[i + 1] = THREE.MathUtils.clamp(
            positions[i + 1],
            -bounds.height,
            bounds.height
        );
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;
}