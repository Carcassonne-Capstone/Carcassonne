import React, { Component } from 'react'
import * as THREE from 'three'
import {createCube} from './renderFuncs/createTile'
import {connect} from 'react-redux'
import {rotate} from '../store'
import socket from '../socket';

class CurrentTile extends Component {
  constructor(props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.addCube = this.addCube.bind(this)
    this.initializeCamera = this.initializeCamera.bind(this)
    this.nextPlayer = this.nextPlayer.bind(this)
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
    if (prevProps.curTile !== this.props.curTile || prevProps.currentPlayer.name !== this.props.currentPlayer.name) {
      this.addCube()
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
    this.scene.remove(this.cube)
    if (this.props.player.name === this.props.currentPlayer.name) {
      this.cube = createCube(this.props.curTile, 0, 0)
      this.scene.add(this.cube)
    }
  }
  
  nextPlayer() {
    socket.emit('turnEnded', this.props.currentPlayer, this.props.players, this.props.roomId)
  }

  render() {
    return (
        <div id="playerTile">
            <div
                style={{ width: '15vw', height: '15vw' }}
                ref={(mount) => { this.mount = mount }}
            />
            <button onClick={this.props.rotate}> Rotate </button>
            <button onClick={this.nextPlayer}>End Turn</button>
        </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    curTile: state.curTile,
    currentPlayer: state.currentPlayer,
    players: state.players,
    roomId: state.roomId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    rotate: () => dispatch(rotate())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentTile)
