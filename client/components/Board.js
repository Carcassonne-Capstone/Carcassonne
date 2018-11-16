import React, { Component } from 'react'
import * as THREE from 'three'
import {createCube} from './renderFuncs/createTile'
const OrbitControls = require('three-orbit-controls')(THREE)
import CurrentTile from './CurrentTile'

class Board extends Component {
  constructor(props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.addCube = this.addCube.bind(this)
    this.initializeCamera = this.initializeCamera.bind(this)
    this.initializeOrbits = this.initializeOrbits.bind(this)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)
    this.initializeOrbits();
    this.initializeCamera();
    this.addCube(createCube({id: 0}, 0, 0))
    this.animate()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)
    this.mount.removeChild(this.renderer.domElement)
  }

  initializeOrbits() {
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
  }

  initializeCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  addCube(cube) {
    this.scene.add(cube)
  }

  render() {
    return (
        <div>
            <div
                id="boardCanvas"
                style={{ width: '80vw', height: '40vw' }}
                ref={(mount) => { this.mount = mount }}
            />
            <CurrentTile />
        </div>
    )
  }
}

export default Board