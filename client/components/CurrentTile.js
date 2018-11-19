import React, { Component } from 'react'
import * as THREE from 'three'
import {createCube} from './renderFuncs/createTile'
import {connect} from 'react-redux'
import {rotate} from '../store'

class CurrentTile extends Component {
  constructor(props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.addCube = this.addCube.bind(this)
    this.initializeCamera = this.initializeCamera.bind(this)
    this.rotate = this.rotate.bind(this);
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
    this.addCube()
    this.animate()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)
    this.mount.removeChild(this.renderer.domElement)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.curTile !== this.props.curTile) {
      this.scene.remove(this.cube)
      this.cube = createCube(this.props.curTile, 0, 0)
      this.scene.add(this.cube)
    }
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

  addCube() {
    if (this.props.player.name === this.props.currentPlayer.name) {
      this.cube = createCube(this.props.curTile, 0, 0)
      this.scene.add(this.cube)
    } else {
      this.scene.remove.apply(this.scene, this.scene.children)
    }
  }

  rotate() {
    //this.cube.rotation.z -= Math.PI /2;
    this.props.rotate();
  }

  render() {
    return (
        <div id="playerTile">
            <div
                style={{ width: '10vw', height: '10vw' }}
                ref={(mount) => { this.mount = mount }}
            />
            <button onClick={this.rotate}> Rotate </button>
        </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    curTile: state.curTile,
    currentPlayer: state.currentPlayer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    rotate: () => dispatch(rotate())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentTile)
