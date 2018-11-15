import React, { Component } from 'react'
import * as THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE)

const test = () => {
    let board = {}
    board[[0,0]] = 'one'
    board[[0,1]] = 'two'
    console.log(board[[0,1]])
}

class Board extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.addCube = this.addCube.bind(this)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 0.1)
    const material = new THREE.MeshBasicMaterial({ color: 'green' })
    const cube = new THREE.Mesh(geometry, material)

    const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1.01, 0.1, 0.11), new THREE.MeshBasicMaterial({ color: 'white' }))
    cube.add(cube2)
    cube.position.x = 1;
    cube.position.y = 1;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    camera.position.z = 4


    const tempCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), new THREE.MeshBasicMaterial({ color: 'green' }))
    tempCube.position.x = 2;
    tempCube.position.y = 2;
    scene.add(tempCube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.cube = cube
    this.controls = controls

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
  }

  addCube() {
    this.scene.add(this.cube)
  }

  render() {
    return (
        <div>
            <div
                style={{ width: '80vw', height: '40vw' }}
                ref={(mount) => { this.mount = mount }}
            />
            <button type="button" onClick={this.addCube}>Submit</button>
        </div>
    )
  }
}

export default Board