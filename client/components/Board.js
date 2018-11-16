import React, { Component } from "react";
import * as THREE from "three";
import { createCube, createBlankTile } from "./renderFuncs/createTile";
const OrbitControls = require("three-orbit-controls")(THREE);
import CurrentTile from "./CurrentTile";

class Board extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.addCube = this.addCube.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.initializeOrbits();
    this.initializeCamera();
    this.addCube(createCube({ id: 0 }, 0, 0));

    let tile1 = createBlankTile({ id: 4 }, 0, 1);
    let tile2 = createBlankTile({ id: 6 }, 1, 0);
    let tile3 = createBlankTile({ id: 8 }, -1, 0);
    let tile4 = createBlankTile({ id: 10 }, 0, -1);
    let objects = [tile2, tile1, tile4, tile3];

    this.addCube(tile1);
    this.addCube(tile2);
    this.addCube(tile3);
    this.addCube(tile4);
    this.animate();

    const onDocMouseDown = e => {
      e.preventDefault();
      const mouse3D = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      const raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(mouse3D, this.camera);
      var intersects = raycaster.intersectObjects(objects);
      console.log("intersects:", intersects);
      console.log("objects***", objects);

      if (intersects.length > 0) {
        console.log("im here");
        //const createdCube1 = createCube(tile1);
        console.log("TILE 1", tile1);
        // this.scene.add(createdCube1);
        // this.scene.remove(this.createdCube);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown, false);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  initializeOrbits() {
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
  }

  initializeCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  addCube(cube) {
    this.scene.add(cube);
  }

  render() {
    return (
      <div>
        <div
          id="boardCanvas"
          style={{ width: "80vw", height: "40vw" }}
          ref={mount => {
            this.mount = mount;
          }}
        />
        <CurrentTile />
      </div>
    );
  }
}

export default Board;
