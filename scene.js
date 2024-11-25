import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});

export function initScene() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(50);
    
    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(pointLight, ambientLight);
    
    // Background
    scene.background = new THREE.Color(0x0a0a2a);
}

export function getViewportBounds() {
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * Math.abs(camera.position.z);
    const width = height * camera.aspect;
    return {
        width: width,
        height: height
    };
}