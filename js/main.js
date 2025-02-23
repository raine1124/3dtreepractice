import * as THREE from 'three';
import { TreePointCloud } from './TreePointCloud.js';
import { CameraController } from './CameraController.js';
import { BoxEnvironment } from './BoxEnviroment.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create smaller box for better visibility
const boxSize = Math.min(window.innerWidth, window.innerHeight) * 0.4;

// Create tree first
const tree = new TreePointCloud({
    height: boxSize * 0.4,
    radiusBase: boxSize * 0.02,
    branchLevels: 5,
    pointsPerLevel: 2000,
    colorVariation: 0.3,
    baseColor: 0x2E8B57
});
scene.add(tree.getPoints());

// Add box environment
const box = new BoxEnvironment(boxSize);
scene.add(box.getPoints());

// Basic lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Camera setup
camera.position.set(0, boxSize * 0.3, boxSize * 0.8);
const cameraController = new CameraController(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    tree.animate();
    cameraController.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});