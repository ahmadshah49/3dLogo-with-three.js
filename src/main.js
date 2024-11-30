import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { log } from "three/webgpu";

const scene = new Three.Scene();

const cubeGeometry = new Three.BoxGeometry(1, 1, 1);
const cubeMaterial = new Three.MeshBasicMaterial({ color: "red" , wireframe:true});
const cubeMesh = new Three.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.rotation.x=5


scene.add(cubeMesh)



const axesHelper = new Three.AxesHelper(2);


const camera = new Three.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
const aspectRatio = window.innerWidth / window.innerHeight;

camera.position.z = 5;


const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

const controls = new OrbitControls(camera, canvas);
controls.autoRotate =false;
controls.enableDamping = true;

const clock=new Three.Clock()


let prevTime=0


const renderLoop = () => {
  const currentTime=clock.getElapsedTime()
  
  const delta=currentTime-prevTime
  console.log("Delta",delta);  
  prevTime=currentTime
  
    camera.aspect = window.innerWidth / window.innerHeight;
  
  cubeMesh.rotation.z+=Three.MathUtils.degToRad(1)*delta*40
  controls.update();
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
