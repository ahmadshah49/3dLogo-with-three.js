import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import lod from "../public/textures/uvMappingTest.jpg";

const pane = new Pane();
const scene = new Three.Scene();
const textureLoader = new Three.TextureLoader();
const cubeTextureLoader = new Three.CubeTextureLoader();
cubeTextureLoader.setPath("../public/textures/cubeMap/");

// adding textures
const sunTexture = textureLoader.load("../public/textures/2k_sun.jpg");
sunTexture.colorSpace = Three.SRGBColorSpace;
const mercuryTexture = textureLoader.load("../public/textures/2k_mercury.jpg");
mercuryTexture.colorSpace = Three.SRGBColorSpace;
const venusTexture = textureLoader.load(
  "../public/textures/2k_venus_surface.jpg"
);
venusTexture.colorSpace = Three.SRGBColorSpace;
const earthTexture = textureLoader.load(
  "../public/textures/2k_earth_daymap.jpg"
);
earthTexture.colorSpace = Three.SRGBColorSpace;
const marsTexture = textureLoader.load("../public/textures/2k_mars.jpg");
marsTexture.colorSpace = Three.SRGBColorSpace;
const moonTexture = textureLoader.load("../public/textures/2k_moon.jpg");
moonTexture.colorSpace = Three.SRGBColorSpace;

const backgroundCubemap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);

scene.background = backgroundCubemap;
const mercuryMaterial = new Three.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new Three.MeshStandardMaterial({
  map: venusTexture,
});
const earthMaterial = new Three.MeshStandardMaterial({
  map: earthTexture,
});
const marsMaterial = new Three.MeshStandardMaterial({
  map: marsTexture,
});
const moonMaterial = new Three.MeshStandardMaterial({
  map: moonTexture,
});
const sphereGeometry = new Three.SphereGeometry(1, 32, 32);
const sunMaterial = new Three.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new Three.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);
const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];

const createPlanet = (planet) => {
  const planetMesh = new Three.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  return planetMesh;
};
const createMoon = (moon) => {
  const moonMesh = new Three.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};
const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);
  planet.moons.map((moon) => {
    const moonMesh = createMoon(moon);

    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

const ambientLight = new Three.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const camera = new Three.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  40000
);

camera.position.z = 100;
camera.position.y = 5;

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
controls.autoRotate = false;

const clock = new Three.Clock();

const renderLoop = () => {
  const currentTime = clock.getElapsedTime();
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += planets[index].speed;
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance;
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[index].moons[moonIndex].speed;
      console.log(moon);
    });
  });
  controls.update();
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();

// const earthTexture = textureLoader.load("../public/textures/planet.png");
// earthTexture.colorSpace = Three.SRGBColorSpace;
