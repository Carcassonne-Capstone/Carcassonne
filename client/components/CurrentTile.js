import React, { Component } from 'react'
import * as THREE from 'three'
import {createCube} from './renderFuncs/createTile'
import {connect} from 'react-redux'

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
    this.addCube()
    this.animate()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)
    this.mount.removeChild(this.renderer.domElement)
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.currentPlayer)
    if (prevProps.curTile !== this.props.curTile) {
      console.log('should update')
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
      this.scene.add(createCube(this.props.curTile[0], 0, 0))
    } else {
      this.scene.remove.apply(this.scene, this.scene.children)
    }
  }

  render() {
    return (
        <div id="playerTile">
            <div
                style={{ width: '10vw', height: '10vw' }}
                ref={(mount) => { this.mount = mount }}
            />
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

export default connect(mapStateToProps)(CurrentTile)