import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { scene, getViewportBounds } from './scene.js';

const texts = ['Developer', 'Creator', 'Innovator'];
let textMeshes = [];
let currentTextIndex = 0;
const textSpeed = 0.02;

export async function initFloatingText() {
    const loader = new THREE.FontLoader();
    const bounds = getViewportBounds();
    
    try {
        const font = await loader.loadAsync('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json');
        
        texts.forEach((text, index) => {
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: 2,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            });
            
            textGeometry.center();
            
            const textMaterial = new THREE.MeshPhongMaterial({
                color: 0x88ccff,
                transparent: true,
                opacity: 0
            });
            
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            // Position texts in different corners
            textMesh.position.set(
                (index % 2 === 0 ? -1 : 1) * bounds.width / 3,
                (index < 1 ? 1 : -1) * bounds.height / 3,
                -20
            );
            textMeshes.push(textMesh);
            scene.add(textMesh);
        });
    } catch (error) {
        console.error('Error loading font:', error);
    }
}

export function updateFloatingText() {
    const time = Date.now() * 0.001;
    
    textMeshes.forEach((mesh, index) => {
        // Orbital floating animation
        const angle = time * textSpeed + (index * Math.PI * 2 / texts.length);
        const radius = 15;
        
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius - 20;
        
        // Look at center
        mesh.lookAt(0, 0, -20);
        
        // Fade in/out based on position
        const distanceFromFront = Math.abs(mesh.position.z + 20);
        mesh.material.opacity = 1 - (distanceFromFront / 20);
    });
}