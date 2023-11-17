import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";


const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
})

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const scene = new THREE.Scene();

renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth,window.innerHeight);

camera.position.setZ(30);

renderer.render(scene,camera);

const geometry = new THREE.RingGeometry(0,7,32);
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

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function animate()
{
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  ring.rotation.x += 0.01;
  ring.rotation.y += 0.01;
  ring.rotation.z += 0.01;

  controls.update();

  renderer.render(scene,camera);
}

animate();

window.onload = function(){
  document.getElementById('icon').addEventListener('click',toggleNav);

  function toggleNav() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
}



