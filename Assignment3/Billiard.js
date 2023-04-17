/* global THREE */
import * as THREE from '../moduleLibs/build/three.module.js';
import { TrackballControls } from "../moduleLibs/examples/jsm/controls/TrackballControls.js";
// import * as TrackballControls from '../lib/TrackballControls.js';

"use strict";
// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setClearColor('#ffffff');    // set background color
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a new Three.js scene with camera and light
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height,
  0.1, 1000);

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

camera.position.set(10, 5, 8);
camera.lookAt(scene.position);

// * Add your billiard simulation here
//define constants
const extrudeSettings = {
  steps: 2,
  depth: 0.5,
  bevelEnabled: false,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1
};

const extrudeSettings1 = {
  steps: 2,
  depth: 0.3,
  bevelEnabled: false,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1
};
const ground = {
  width: 30,
  height: 30,
  depth: 1,
  adjustment: 11.7
};

const space = 0.5;
const height = 2.6;
const no = 8; //number of billiard balls
const radius = 0.2;

const dimensions = {
  tableLength: 10,
  tableWidth: 5,
}
const length = dimensions.tableLength - space;
const width = dimensions.tableWidth - space;

// light source with light bulb indicating the position of the light
const light = new THREE.PointLight();
light.position.set(0, length / 3, 0);
const lightBulb = new THREE.Mesh(new THREE.SphereBufferGeometry(0.4),
  new THREE.MeshStandardMaterial({ color: 'yellow' }));
lightBulb.position.copy(light.position);
light.castShadow = true;
scene.add(light);
light.add(lightBulb);

//create wall and ground
const geo = new THREE.BoxGeometry(ground.width, ground.height, ground.depth);
const mat = new THREE.MeshStandardMaterial({ color: 'rgb(144, 12, 63 )' })
const groundMesh = new THREE.Mesh(geo, mat);
const wall1Mesh = new THREE.Mesh(geo, mat);
const wall2Mesh = new THREE.Mesh(geo, mat);
const ceilingMesh = groundMesh.clone();
ceilingMesh.position.y = ground.height - height - ground.depth;
ceilingMesh.rotation.x = Math.PI / 2;
ceilingMesh.castShadow = true;
ceilingMesh.receiveShadow = true;
groundMesh.rotation.x = Math.PI / 2;
groundMesh.position.y = -(2 * extrudeSettings.depth + height - radius);
groundMesh.receiveShadow = true;
wall1Mesh.position.z = - ground.width / 2;
wall1Mesh.position.y = ground.adjustment;
wall2Mesh.position.x = -(ground.width / 2);
wall2Mesh.rotation.y = -Math.PI / 2;
wall2Mesh.position.y = (ground.adjustment);
wall2Mesh.castShadow = true;
wall2Mesh.receiveShadow = true;
wall1Mesh.castShadow = true;
wall1Mesh.receiveShadow = true;
const wall_ground = new THREE.Group();
wall_ground.add(groundMesh, wall1Mesh, wall2Mesh, ceilingMesh);
scene.add(wall_ground);

// add playing surface
const planeMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(width, length, 20, 20),
  new THREE.MeshStandardMaterial({
    wireframe: false,
    color: 0x00ff00,
    side: THREE.DoubleSide
  }));
planeMesh.rotation.x = Math.PI / 2;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

const planeMesh1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(width + space, length + space, 20, 20),
  new THREE.MeshStandardMaterial({
    wireframe: false,
    color: 'rgb(139,69,19)',
    side: THREE.DoubleSide
  }));
planeMesh1.rotation.x = Math.PI / 2;
planeMesh1.position.y = - extrudeSettings1.depth;
planeMesh1.castShadow = true;
scene.add(planeMesh1);

const cushionDepth = 0.05;
const planeMesh3 = new THREE.Mesh(new THREE.BoxGeometry(2 * radius, length, cushionDepth),
  new THREE.MeshStandardMaterial({
    wireframe: false,
    color: 0x00ff00,
    side: THREE.DoubleSide
  }));
planeMesh3.rotation.x = Math.PI / 2;
planeMesh3.rotation.y = Math.PI / 2;
planeMesh3.position.x = -width / 2;
planeMesh3.receiveShadow = true;
const planeMesh4 = planeMesh3.clone();
planeMesh4.position.x = width / 2;
scene.add(planeMesh3, planeMesh4);

const planeMesh5 = new THREE.Mesh(new THREE.BoxGeometry(2 * radius, width, 0.05),
  new THREE.MeshStandardMaterial({
    wireframe: false,
    color: 0x00ff00,
    side: THREE.DoubleSide
  }));
planeMesh5.rotation.z = Math.PI / 2;
planeMesh5.position.z = -length / 2;
planeMesh5.receiveShadow = true;
const planeMesh6 = planeMesh5.clone();
planeMesh6.position.z = length / 2;
scene.add(planeMesh5, planeMesh6);

const chordD = {
  width: 0.1,
  height: lightBulb.position.distanceTo(ceilingMesh.position) - 3,
  depth: 0.1,
  chordAdjustment: 5.2
};

const chord = new THREE.Mesh(new THREE.BoxGeometry(chordD.width, chordD.height, chordD.depth),
  new THREE.MeshStandardMaterial({
    wireframe: false,
    color: 0x000000,
    side: THREE.DoubleSide
  }));
chord.position.y = chordD.chordAdjustment * lightBulb.position.distanceTo(planeMesh.position);
scene.add(chord);

// add table surface
const shape1 = new THREE.Shape();
shape1.moveTo(0, 0);
shape1.lineTo(-space, -space);
shape1.lineTo(-space, space + length);
shape1.lineTo(0, length);
shape1.lineTo(0, 0);
shape1.moveTo(0, length);
shape1.lineTo(-space, space + length);
shape1.lineTo(space + width, space + length);
shape1.lineTo(width, length);
shape1.lineTo(0, length);

const shape2 = new THREE.Shape();
shape2.moveTo(width, length);
shape2.lineTo(space + width, space + length);
shape2.lineTo(width + space, -space);
shape2.lineTo(width, 0);
shape2.lineTo(width, length);
shape2.moveTo(width, 0);
shape2.lineTo(width + space, -space);
shape2.lineTo(-space, -space);
shape2.lineTo(0, 0);
shape2.lineTo(width, 0);

const shape3 = new THREE.Shape();
shape3.moveTo(0, -extrudeSettings.depth);
shape3.lineTo(width, -extrudeSettings.depth);
shape3.lineTo(width - 0.2, -(extrudeSettings.depth + height));
shape3.lineTo(0.2, -(extrudeSettings.depth + height));
shape3.lineTo(0, -extrudeSettings.depth);

const geometry3 = new THREE.ExtrudeGeometry(shape1, extrudeSettings);
const material3 = new THREE.MeshStandardMaterial({ color: 'rgb(139,69,19)' });
const geometry4 = new THREE.ExtrudeGeometry(shape2, extrudeSettings);
const geometry5 = new THREE.ExtrudeGeometry(shape3, extrudeSettings1);

const mesh2 = new THREE.Mesh(geometry3, material3);
const mesh3 = new THREE.Mesh(geometry4, material3);
const mesh4 = new THREE.Mesh(geometry5, material3);
mesh2.castShadow = true;
mesh3.castShadow = true;
mesh4.castShadow = true;

const table = new THREE.Group();
table.add(mesh2, mesh3);
table.rotateX(Math.PI / 2);

let mesh5 = mesh4.clone();
mesh4.position.z = length - space;
const legs = new THREE.Group();
legs.add(table, mesh4, mesh5);
scene.add(legs);
legs.position.x = -width / 2;
legs.position.z = -length / 2;
legs.position.y = radius;


//texture loader
const txtLoader = new THREE.TextureLoader();
const urls = [
  'PoolBallSkins/Ball8.jpg',
  'PoolBallSkins/Ball9.jpg',
  'PoolBallSkins/Ball10.jpg',
  'PoolBallSkins/Ball11.jpg',
  'PoolBallSkins/Ball12.jpg',
  'PoolBallSkins/Ball13.jpg',
  'PoolBallSkins/Ball14.jpg',
  'PoolBallSkins/Ball15.jpg',
];

// add balls 
const balls = [];
for (let i = 0; i < no; i++) {
  const txt = txtLoader.load(urls[i]);
  const g = new THREE.SphereGeometry(radius, 32, 16);
  const m = new THREE.MeshStandardMaterial({
    map: txt,
    wireframe: false
  });
  const cm = new THREE.Mesh(g, m);
  cm.position.y = radius;
  balls[i] = cm;
  balls[i].matrixAutoUpdate = false;
  balls[i].castShadow = true;
  scene.add(balls[i]);
}

// * Render loop
const controls = new TrackballControls(camera, renderer.domElement);

// random number
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

const speedLimit = 3;
const speeds = [];
const ballpos = [];
for (let i = 0; i < no; i++) {
  let speed = new THREE.Vector3(getRandomIntInclusive(-speedLimit, speedLimit), 0, getRandomIntInclusive(-speedLimit, speedLimit));
  speeds[i] = speed;

  let pos = new THREE.Vector3(getRandomIntInclusive(-(width / 5), width / 5), radius,
    getRandomIntInclusive(-(length / 5), length / 5));
  ballpos.forEach(element => {
    if (pos == element) {
      pos = new THREE.Vector3(getRandomIntInclusive(-(width / 5), width / 5), 0,
        getRandomIntInclusive(-(length / 5), length / 5));
    }
  });
  ballpos[i] = pos;
}

const clock = new THREE.Clock();
const planeNormal = new THREE.Vector3(0, 1, 0);

let last = 0;
let count = 1;
function render(t) {
  requestAnimationFrame(render);
  // Motion of the ball in this time step
  const h = clock.getDelta();

  // adding friction after every second
  let timeSecond = t / 1000;
  if (timeSecond - last >= count) {
    last = timeSecond;
    for (let i = 0; i < no; i++) {
      speeds[i].z = speeds[i].z * 0.8;
      speeds[i].x = speeds[i].x * 0.8;
    }
  }

  for (let i = 0; i < no; i++) {
    ballpos[i].add((speeds[i]).clone().multiplyScalar(h));

    let om = speeds[i].length() / radius;
    let axis = planeNormal.clone().cross(speeds[i]).normalize();

    const dR = new THREE.Matrix4().makeRotationAxis(axis, om * h);
    balls[i].matrix.premultiply(dR);
    balls[i].matrix.setPosition(ballpos[i]);

  }

  // Reflection at the invisible walls
  for (let i = 0; i < no; i++) {
    if (ballpos[i].x > width / 2 - radius) {
      speeds[i].x = - Math.abs(speeds[i].x) * 0.8;
      speeds[i].z = speeds[i].z * 0.8;
    }
    if (ballpos[i].z + radius > length / 2) {
      speeds[i].z = - Math.abs(speeds[i].z) * 0.8;
      speeds[i].x = speeds[i].x * 0.8;
    }
    if (ballpos[i].x < - width / 2 + radius) {
      speeds[i].x = Math.abs(speeds[i].x) * 0.8;
      speeds[i].z = speeds[i].z * 0.8;
    }
    if (ballpos[i].z < - length / 2 + radius) {
      speeds[i].z = Math.abs(speeds[i].z) * 0.8;
      speeds[i].x = speeds[i].x * 0.8;
    }
  }
  ;
  // detecting collision
  for (let i = 0; i < no - 1; i++) {
    for (let j = i + 1; j < no; j++) {
      let r = ballpos[i].distanceTo(ballpos[j]);
      if (r <= radius) {
        // let d = ballpos[j].sub(ballpos[i]);
        // let u = speeds[i].sub(speeds[j]); 
        // let dm = u.lengthSq();
        // let du = d.clone().dot(u);
        // let du1 = du/dm;
        // let du2 = d.clone().multiplyScalar(du1);
        // speeds[i].clone() = speeds[i].clone().sub(du2);
        // speeds[j].clone() = speeds[j].clone().add(du2);
        // speeds[i].z = -speeds[i].z * 0.7;
        // speeds[i].x = -speeds[i].x * 0.7;
      }
    }
  }

  controls.update();
  renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
}
render();