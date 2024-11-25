import { initScene, renderer, scene, camera } from './scene.js';
import { initParticleSystem, updateParticles, handleMouseMove } from './particles.js';

initScene();
initParticleSystem();

// Mouse tracking
document.addEventListener('mousemove', handleMouseMove);

function animate() {
    requestAnimationFrame(animate);
    updateParticles();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});