import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene setup
const scene = new Three.Scene();
scene.background = new Three.Color(0x000000);

const textureLoader = new Three.TextureLoader();
const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1, 10);
scene.add(camera);

const planetTexture = textureLoader.load("../public/textures/planet.png");
planetTexture.colorSpace = Three.SRGBColorSpace;

const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({ canvas ,antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);


// Lighting
const ambientLight = new Three.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new Three.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new Three.PointLight(0xffffff, 3);
pointLight.position.set(4, 2, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// Load central model
// const loader = new GLTFLoader();
// loader.load("./3Dlogo.gltf", (gltf) => {
//   const model = gltf.scene;
//   model.scale.setScalar(30);
//   // model.rotation.y=-0.04
//   scene.add(model);
//   function animate() {
//     requestAnimationFrame(animate);

//     // Apply a rotation to the model (rotate around Y-axis for spinning)
//     model.rotation.y += 0.01; // Adjust the value for faster/slower spinning

//     renderer.render(scene, camera); // Render the scene
//   }

//   animate(); // Start the animation
// });
const loader = new GLTFLoader();
loader.load("./3Dlogo.gltf", (gltf) => {
  const model = gltf.scene;
  model.scale.setScalar(30); // Scale the model
  scene.add(model);

  // Function to update model rotation based on mouse movement
  const onMouseMove = (event) => {
    // Normalize mouse position: range of -1 to 1 (from left to right)
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1; // From -1 to 1 (horizontal axis)
    // const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // From -1 to 1 (vertical axis)

    // Apply rotation based on mouse position
    // Rotate the model around the Y-axis (left and right)
    model.rotation.y = Three.MathUtils.lerp(
      -Math.PI / 8,
      Math.PI / 8,
      (mouseX + 1) / 2
    ); // Limit to -PI/2 to PI/2

    // Rotate the model around the X-axis (up and down), with a limit of +-PI/4
    model.rotation.x = Three.MathUtils.lerp(
      -Math.PI / 4,
      Math.PI / 4,
      (mouseY + 1) / 2
    ); // Limit to -PI/4 to PI/4
  };

  // Listen for mouse movement
  window.addEventListener("mousemove", onMouseMove);

  // Animation loop (if you want to keep other animations running)
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate(); // Start the animation
});

// Sphere 1
const sphere1Geometry = new Three.SphereGeometry(0.1, 32, 32);
const sphere1Material = new Three.MeshStandardMaterial({
  color: 0xffffff,
  map: planetTexture,
});
const sphere1 = new Three.Mesh(sphere1Geometry, sphere1Material);
sphere1.rotateOnAxis=2
scene.add(sphere1);

const orbit1Curve = new Three.EllipseCurve(0, 0, 3, 2, 0, 2 * Math.PI, false);
const orbit1Points = orbit1Curve.getPoints(100);
const orbit1Geometry = new Three.BufferGeometry().setFromPoints(orbit1Points);
const orbit1Material = new Three.LineBasicMaterial({ color: 0x888888 });
const orbit1 = new Three.Line(orbit1Geometry, orbit1Material);
orbit1.rotation.x = Math.PI / 2;
scene.add(orbit1);

const fontLoader = new FontLoader();
fontLoader.load("/fonts/Outfit_Thin_Regular.json", (font) => {
  const text1Geometry = new TextGeometry("Efficiency", {
    font: font,
    size: 0.2,
    height: 0.005,
  });
  const text1Material = new Three.MeshStandardMaterial({ color: 0xffffff });
  const text1Mesh = new Three.Mesh(text1Geometry, text1Material);
  text1Mesh.position.set(-0.6, 0.1, 0.1);
  sphere1.add(text1Mesh);
  //  text1Mesh.rotation.x = Math.PI / 2; // Ensure text stays upright
  //  text1Mesh.scale.x = 1;
  //  text2Mesh.position.set(-0.6, 0.1, 0.1);
});

// Sphere 2
const sphere2Geometry = new Three.SphereGeometry(0.1, 32, 32);
const sphere2Material = new Three.MeshStandardMaterial({
  color: 0xffffff,
  map: planetTexture,
});
const sphere2 = new Three.Mesh(sphere2Geometry, sphere2Material);
sphere2.rotateX
scene.add(sphere2);

const orbit2Curve = new Three.EllipseCurve(0, 0, 4, 3, 0, 2 * Math.PI, false);
const orbit2Points = orbit2Curve.getPoints(100);
const orbit2Geometry = new Three.BufferGeometry().setFromPoints(orbit2Points);
const orbit2Material = new Three.LineBasicMaterial({ color: 0x888888 });
const orbit2 = new Three.Line(orbit2Geometry, orbit2Material);
orbit2.rotation.x = Math.PI / 2;
scene.add(orbit2);

fontLoader.load("/fonts/Outfit_Thin_Regular.json", (font) => {
  const text2Geometry = new TextGeometry("Creativity", {
    font: font,
    size: 0.2,
    height: 0.005,
  });
  const text2Material = new Three.MeshStandardMaterial({ color: 0xffffff });
  const text2Mesh = new Three.Mesh(text2Geometry, text2Material);
  text2Mesh.position.set(-0.6, 0.1, 0.1);
  sphere2.add(text2Mesh);
});

// Sphere 3
const sphere3Geometry = new Three.SphereGeometry(0.1, 32, 32);
const sphere3Material = new Three.MeshStandardMaterial({
  color: 0xffffff,
  map: planetTexture,
});
const sphere3 = new Three.Mesh(sphere3Geometry, sphere3Material);
sphere3.rotation.x = Math.PI / 2;
// sphere3.rotation.y = Math.PI / 10; // 45 degrees tilt
// sphere3.rotation.z = Math.PI / 16;
scene.add(sphere3);

const orbit3Curve = new Three.EllipseCurve(0, 0, 5, 4, 0, 2 * Math.PI, false);
const orbit3Points = orbit3Curve.getPoints(100);
const orbit3Geometry = new Three.BufferGeometry().setFromPoints(orbit3Points);
const orbit3Material = new Three.LineBasicMaterial({ color: 0x888888 });
const orbit3 = new Three.Line(orbit3Geometry, orbit3Material);
orbit3.rotation.x = Math.PI / 2;
  // orbit3.rotation.y = Math.PI / 10; // 45 degrees tilt
  // orbit3.rotation.z = Math.PI / 16; // 45 degrees tilt
scene.add(orbit3);

fontLoader.load("/fonts/Outfit_Thin_Regular.json", (font) => {
  const text3Geometry = new TextGeometry("Reliability", {
    font: font,
    size: 0.2,
    height: 0.005,
  });
  const text3Material = new Three.MeshStandardMaterial({ color: 0xffffff });
  const text3Mesh = new Three.Mesh(text3Geometry, text3Material);
  text3Mesh.position.set(-0.6, 0.1, 0.1);
  sphere3.add(text3Mesh);
});

// Animate
let angle = 0;
function animate() {
  angle += 0.01;

  sphere1.position.x = 3 * Math.cos(angle);
  sphere1.position.z = 2 * Math.sin(angle);
  sphere1.position.y = 0;
  sphere1.lookAt(0, 0, 0);

  sphere2.position.x = 4 * Math.cos(angle + 0.2);
  sphere2.position.z = 3 * Math.sin(angle + 0.2);
  sphere2.position.y = 0;
  sphere2.lookAt(0, 0, 0);

  sphere3.position.x = 5 * Math.cos(angle + 0.4);
  sphere3.position.z = 4 * Math.sin(angle + 0.4);
  sphere3.position.y = 0
  
  sphere3.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom=false

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
