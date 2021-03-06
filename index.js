//import './style.css'

import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

camera.position.setZ(30);

renderer.render(scene,camera);

const geometry = new THREE.RingGeometry(0,5,32);
const material = new THREE.MeshStandardMaterial({color: 0x651FFF});
const ring = new THREE.Mesh(geometry,material);

scene.add(ring);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight,ambientLight);

//scene.add(lightHelper,gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar()
{
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(150));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(250).fill().forEach(addStar);

// const spaceTexture = new THREE.TextureLoader().load('Space.jpg');
//scene.background = spaceTexture;

function moveCamera()
{
  const t = document.body.getBoundingClientRect().top;

  camera.position.x = t*-0.03;
  camera.position.y = t*-0.0002;
  //camera.position.z = t*-0.0002;
}

document.body.onscroll = moveCamera;

function animate()
{
  requestAnimationFrame(animate);

  ring.rotation.x += 0.01;
  ring.rotation.y += 0.01;
  ring.rotation.z += 0.01;

  controls.update();

  renderer.render(scene,camera);
}

animate();



