
import * as THREE from 'three';
var scene = THREE.scene 

const floorGeometry = new THREE.PlaneGeometry(6, 6);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 'white' });

const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotateX(-Math.PI / 2);
THREE.scene.add(floor);



const coneGeometry = new THREE.ConeGeometry(0.6, 1.5);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 'purple' });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);
cone.position.set(0.4, 0.75, -1.5);


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 'orange' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);
cube.position.set(-0.8, 0.5, -1.5);
cube.rotateY(Math.PI / 4);

const sphereGeometry = new THREE.SphereGeometry(0.4);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(0.6, 0.4, -0.5);
sphere.scale.set(1.2, 1.2, 1.2);
