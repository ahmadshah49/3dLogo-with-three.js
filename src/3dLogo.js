import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new Three.Scene();
scene.background = new Three.Color(0x000000);


const ambientLight = new Three.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);


const directionalLight = new Three.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);


const pointLight = new Three.PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 2);
pointLight.castShadow = true;
scene.add(pointLight);


const pointLightHelper = new Three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);


const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new Three.PerspectiveCamera(7, aspectRatio, 0.1, 100);
camera.position.set(0, 0.4, 4);
scene.add(camera);


const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 


const loader = new GLTFLoader();
let model;
loader.load(
  "./3Dlogo.gltf",
  (gltf) => {
    model = gltf.scene;

    
    model.scale.set(1.5, 1.5, 1.5); 
    model.position.set(0, 0, 0); 
    model.castShadow = true; 
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
controls.dampingFactor = 0.1; 


controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4; 
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;

controls.enablePan = false;


const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const renderLoop = () => {
  
  if (model) {
    model.rotation.y = mouse.x * 0.5; 
    model.rotation.x = mouse.y * 0.5; 
  }

  controls.update(); 
  renderer.render(scene, camera); 
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
