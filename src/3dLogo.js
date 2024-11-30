import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


const scene = new Three.Scene();


const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new Three.PerspectiveCamera(
  12,
  window.innerWidth / window.innerHeight,
  0.1,
  75
);
camera.position.set(0, 0,1);


const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
  antialias:true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const ambientLight = new Three.AmbientLight(0xffffff, 5);
scene.add(ambientLight);
ambientLight.position.x=1
ambientLight.position.y=1
const axesHelper = new Three.AxesHelper(2);
scene.add(axesHelper)
const loader = new GLTFLoader();
loader.load(
  "./3Dlogo.gltf",
  (gltf) => {
    const model = gltf.scene;
    console.log("Model loaded successfully:", model);

    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);

    scene.add(model);
  },
  (xhr) => {
    console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error("An error occurred while loading the model:", error);
  }
);

const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.enableZoom = true;
controls.keyPanSpeed = 200;

const renderLoop = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();










