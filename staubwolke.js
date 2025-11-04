import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';


let camera, scene, renderer, xrSession;
let particles;
let lightBeam;
let controller1, controller2;

let controllerGrip1, controllerGrip2;

function init() {
    scene = new THREE.Scene();

    // Setup Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Setup Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Enable WebXR
    document.body.appendChild(renderer.domElement);

    // Create Light Beam
    const lightGeometry = new THREE.ConeGeometry(0.2, 5, 32);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    lightBeam = new THREE.Mesh(lightGeometry, lightMaterial);
    lightBeam.position.y = -2.5; // Position the beam in the world
    lightBeam.rotation.x = Math.PI;
    scene.add(lightBeam);


    // Create Particles (Dust Flakes)
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 2; // Slightly more on x-axis
        const y = (Math.random() - 0.5) * 5; // Spread on y-axis
        const z = (Math.random() - 0.5) * 2; // slightly more on z axis
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;


        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.5);
        colors[i*3] = color.r;
        colors[i*3 + 1] = color.g;
        colors[i*3 + 2] = color.b;


        sizes[i] = Math.random() * 0.03 + 0.01; // Random size

    }


    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));


    const particleMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    })
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);


    // Setup XR Controllers
    const controllerModelFactory = new XRControllerModelFactory();
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);


    controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add(controllerGrip2);


    // Button to Enter XR
    const enterXrButton = document.createElement('button');
    enterXrButton.textContent = 'Enter XR';
    enterXrButton.addEventListener('click', async () => {
        try {
            xrSession = await navigator.xr.requestSession('immersive-vr', { requiredFeatures: ['local-floor'] });
            renderer.xr.setSession(xrSession);
            enterXrButton.style.display = 'none';
        } catch (error) {
            console.error('Failed to start WebXR session:', error);
        }
    });
    document.body.appendChild(enterXrButton);


    renderer.setAnimationLoop(animate);
}


function onSelectStart(event) {
   
}
function onSelectEnd(event) {

}

function animate(time) {
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i+=3) {
            // Simulate movement of dust flakes
            positions[i + 1] -= Math.sin(time * 0.0002 * (i+1)) * 0.01; //y
            positions[i] -= Math.cos(time * 0.0001 * (i+1)) * 0.005; // x
            positions[i+2] -= Math.cos(time * 0.00012 * (i+1)) * 0.005;

            if(positions[i+1] < -3.5) positions[i+1] = 3.5;
        }
        particles.geometry.attributes.position.needsUpdate = true; // Update positions on GPU
    }



    renderer.render(scene, camera);
}


init();