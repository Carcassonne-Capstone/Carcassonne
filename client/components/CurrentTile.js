import React, { Component } from 'react'
import * as THREE from 'three'
import {createCube} from './renderFuncs/createTile'

class CurrentTile extends Component {
  constructor(props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.addCube = this.addCube.bind(this)
    this.initializeCamera = this.initializeCamera.bind(this)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)
    this.initializeCamera();
    this.addCube(createCube({id: 1}, 0, 0))
    this.animate()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)
    this.mount.removeChild(this.renderer.domElement)
  }

  initializeCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 1;
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
                style={{ width: '10vw', height: '10vw' }}
                ref={(mount) => { this.mount = mount }}
            />
        </div>
    )
  }
}

export default CurrentTile