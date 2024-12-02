import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
const pane = new Pane();
const scene = new Three.Scene();

const cubeGeometry = new Three.BoxGeometry(1, 1, 1);
const cubeMaterial = new Three.MeshPhysicalMaterial({ color: "green" });
cubeMaterial.shininess=90
const torusknotGeometry=new Three.TorusKnotGeometry(0.5,0.15,100,16)
const cubeMesh = new Three.Mesh(cubeGeometry, cubeMaterial);
const cubeMesh1 = new Three.Mesh(torusknotGeometry, cubeMaterial);
cubeMesh.rotation.x = 5;
cubeMesh1.position.x = 2;
scene.add(cubeMesh);
scene.add(cubeMesh1);
pane.addBinding(cubeMaterial, "shininess", {
  min: 0,
  max: 100,
  step: 1,
});
pane.addBinding(cubeMaterial, "metalness", {
  min: 0,
  max: 1,
  step: 0.01,
});
pane.addBinding(cubeMaterial, "roughness", {
  min: 0,
  max: 1,
  step: 0.01,
});
pane.addBinding(cubeMaterial, "reflectivity", {
  min: 0,
  max: 1,
  step: 0.01,
});
const light = new Three.AmbientLight(0xffffff, 1);
scene.add(light);
const pointLight = new Three.PointLight(0xffffff, 100);
pointLight.position.set(5, 1,0);
scene.add(pointLight);
const pointLightHelper = new Three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);


const camera = new Three.PerspectiveCamera(
  750,
  window.innerWidth / window.innerHeight,
  0.1,
  75
);
const aspectRatio = window.innerWidth / window.innerHeight;

camera.position.z = 5;

const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

const controls = new OrbitControls(camera, canvas);
controls.autoRotate = true;
controls.enableDamping = false;
controls.rotateSpeed = 1;

const clock = new Three.Clock();

let prevTime = 0;

const renderLoop = () => {
  const currentTime = clock.getElapsedTime();
  const delta = currentTime - prevTime;
  prevTime = currentTime;
  camera.aspect = window.innerWidth / window.innerHeight;
  cubeMesh.rotation.z += Three.MathUtils.degToRad(1) * delta * 40;
  controls.update();
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
