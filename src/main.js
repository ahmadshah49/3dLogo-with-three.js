import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import lod from "../public/textures/uvMappingTest.jpg";
import { PI } from "three/webgpu";
const pane = new Pane();
const scene = new Three.Scene();
const textureLoader = new Three.TextureLoader();
const planeGeometry = new Three.BoxGeometry;
const material = new Three.MeshStandardMaterial({
  color: "green",
  side: Three.DoubleSide,
});
// material.shininess = 90;

const plane = new Three.Mesh(planeGeometry, material);
const textureTest = textureLoader.load(lod);
// textureTest.repeat.set(10,10)
// textureTest.wrapS=Three.RepeatWrapping
// textureTest.wrapT = Three.RepeatWrapping;
// textureTest.wrapS=Three.MirroredRepeatWrapping
// textureTest.wrapT=Three.MirroredRepeatWrapping
material.map = textureTest;
// plane.position.x = -1.5;
// plane.rotation.x = -Math.PI * 0.5;
plane.scale.set(2,2,2)
scene.add(plane);
const light = new Three.AmbientLight(0xffffff, 1);
scene.add(light);
const pointLight = new Three.PointLight(0xffffff, 100);
pointLight.position.set(5, 1, 0);
scene.add(pointLight);
const pointLightHelper = new Three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const camera = new Three.PerspectiveCamera(
  750,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(1, 2, 10);
camera.position.z = 10;
// camera.position.y = 10;

const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0); 
controls.enableDamping = true; 
controls.zoomSpeed = 1.2; 
controls.enablePan = true;
controls.mouseButtons = {
  LEFT: Three.MOUSE.ROTATE,
  MIDDLE: Three.MOUSE.DOLLY, // Middle mouse button for zooming
  RIGHT: Three.MOUSE.PAN,
};
const clock = new Three.Clock();

let prevTime = 0;
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderLoop = () => {
  const currentTime = clock.getElapsedTime();
  const delta = currentTime - prevTime;
  prevTime = currentTime;

  plane.rotation.y += Three.MathUtils.degToRad(1) * delta * 40;
  controls.update();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
