import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene setup
const scene = new Three.Scene();
scene.background = new Three.Color(0x000000);
const textureLoader = new Three.TextureLoader();    
const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0,3, 10);
scene.add(camera);
const planetTexture = textureLoader.load("../public/textures/planet.png");
planetTexture.colorSpace = Three.SRGBColorSpace;
const canvas = document.querySelector("canvas.threeJs");
const renderer = new Three.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);


const ambientLight = new Three.AmbientLight(0xffffff, 1);

scene.add(ambientLight);

const directionalLight = new Three.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const pointLight = new Three.PointLight(0xffffff, 3);
pointLight.position.set(4, 2, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// const pointLightHelper = new Three.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);


// Central model (light bulb or gear)
const loader = new GLTFLoader();
let model;
loader.load("./3Dlogo.gltf", (gltf) => {
  model = gltf.scene;
  model.scale.setScalar(30);
//   model.rotation.x=1
  scene.add(model);
});

// Create spheres, text, and tilted orbits
const spheres = [];
const orbitData = [
  { radiusX: 3, radiusZ: 2, color: 0xffffff, label: "Efficiency" },
  { radiusX: 4, radiusZ: 3, color: 0xffffff, label: "Creativity" },
  { radiusX: 5, radiusZ: 4, color: 0xffffff, label: "Reliability" },
];

orbitData.forEach((data) => {
  // Sphere
  const sphereGeometry = new Three.SphereGeometry(0.1, 32, 32);
  const sphereMaterial = new Three.MeshStandardMaterial({
    color: data.color,
    map: planetTexture,
  });
  const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
  spheres.push({ mesh: sphere, ...data });
  sphere.position.x=Math.PI/2
  sphere.position.y=Math.PI/10
  scene.add(sphere);

  // Add orbit lines tilted by 45 degrees
  const curve = new Three.EllipseCurve(
    0, 0, // Center of ellipse
    data.radiusX, data.radiusZ, // Radii
    0, 2 * Math.PI, // Start and end angle
    false // Clockwise
  );
  const points = curve.getPoints(100);
  const orbitGeometry = new Three.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new Three.LineBasicMaterial({ color: 0x888888 });
  const orbitLine = new Three.Line(orbitGeometry, orbitMaterial);
  orbitLine.rotation.x = Math.PI / 2; // 45 degrees tilt
//   orbitLine.rotation.y = Math.PI / 10; // 45 degrees tilt
//   orbitLine.rotation.z = Math.PI / 16; // 45 degrees tilt
  scene.add(orbitLine);

  // Add text labels above the spheres
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry(data.label, {
      font: font,
      size: 0.2,
      height: 0.05,
    });
    const textMaterial = new Three.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new Three.Mesh(textGeometry, textMaterial);

    // Position text above the sphere
    textMesh.position.set(0, 0.3, 0); // Adjust height above sphere
    sphere.add(textMesh); // Attach the text to the sphere
  });
});


let angle = 0;
function animate() {
  angle += 0.01; 

  
  spheres.forEach((sphereData, index) => {
    const { mesh, radiusX, radiusZ } = sphereData;
    const rotationAngle = angle + index * 0.2; 

    
    mesh.position.x = radiusX * Math.cos(rotationAngle); 
    mesh.position.z = radiusZ * Math.sin(rotationAngle); 

    mesh.position.y = 0; 

    
    mesh.lookAt(0, 0, 0); 
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
