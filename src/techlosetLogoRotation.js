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

  let isDragging = false; // Track whether the user is dragging
  let previousMouseX = 0; // Store the last mouse X position
  let rotationDeltaY = 0; // Track the rotation change during dragging
  let defaultRotationSpeed = 0.02; // Default rotation speed
  let direction = 1; // 1 for clockwise, -1 for counter-clockwise

  // Restrict rotation range
  const restrictRotation = (rotation) => {
    return Math.max(-Math.PI / 8, Math.min(Math.PI / 8, rotation));
  };

  // Mouse drag event handlers
  const onMouseDown = (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    event.preventDefault(); // Prevent any default behavior (like scrolling)
  };

  const onMouseMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - previousMouseX;
      rotationDeltaY = deltaX * 0.004; // Adjust sensitivity
      model.rotation.y = restrictRotation(model.rotation.y + rotationDeltaY);
      previousMouseX = event.clientX;
    }
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Default rotation logic
    if (!isDragging) {
      model.rotation.y += defaultRotationSpeed * direction;

      // Bounce back at limits
      if (model.rotation.y >= Math.PI / 8 || model.rotation.y <= -Math.PI / 8) {
        direction *= -1; // Reverse direction
        model.rotation.y = restrictRotation(model.rotation.y); // Ensure it stays within bounds
      }
    }

    renderer.render(scene, camera);
  }

  // Add event listeners for drag
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  // Prevent the scene or camera from moving when mouse events occur
  window.addEventListener("wheel", (event) => {
    event.preventDefault(); // Disable scroll behavior
  });

  // Start the animation loop
  animate();
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
controls.enableDamping = false;
controls.enableZoom=false

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
