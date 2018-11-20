import React, { Component } from "react";
import * as THREE from "three";
import { createCube, createBlankTile } from "./renderFuncs/createTile";
const OrbitControls = require("three-orbit-controls")(THREE);
import CurrentTile from "./CurrentTile";
import checkValid from "./renderFuncs/checkValid";
import {connect} from 'react-redux'
import {updateBoard} from '../store'
import socket from '../socket';

class Board extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.changeCurTile = this.changeCurTile.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
    this.updateValidTiles = this.updateValidTiles.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
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
    const initialCube = createCube(this.props.startTile, 0, 0);
    this.scene.add(initialCube);
    this.curTile = null;

    this.validTiles = [];
    this.updateValidTiles();
    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTile.tile !== this.props.currentTile.tile) this.curTile = null
    if (prevProps.curLocation !== this.props.curLocation) {
      this.changeCurTile()
    }
    if (prevProps.unfilledTiles !== this.props.unfilledTiles || prevProps.currentTile.rotation !== this.props.currentTile.rotation ) {
      this.updateValidTiles();
    }
    
  }

  changeCurTile() {
    if (this.curTile) {
      this.scene.remove(this.curTile)
    }
    if (this.props.curLocation) {
      this.curTile = createCube(this.props.currentTile, this.props.curLocation[0], this.props.curLocation[1])
      this.scene.add(this.curTile);
    }
  }

  updateValidTiles() {
    this.validTiles.forEach(tile => this.scene.remove(tile))
    this.validTiles = []
    const validLocations = checkValid(this.props.unfilledTiles, this.props.currentTile);
    for (let key in validLocations) {
      if (validLocations.hasOwnProperty(key)) {
        const coords = key.split(',')
        const x = parseInt(coords[0], 10);
        const y = parseInt(coords[1], 10);
        const validSpot = createBlankTile(null, x, y);
        this.validTiles.push(validSpot);
        this.scene.add(validSpot);
      }
    }
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

  onDocMouseDown(event, tiles) {
    if (this.props.currentPlayer.name === this.props.player.name) {
      const windowArea = event.target.getBoundingClientRect();
      const mouse3D = new THREE.Vector3(
        ( ( event.clientX - windowArea.left ) / ( windowArea.right - windowArea.left ) ) * 2 - 1,
        -( ( event.clientY - windowArea.top ) / ( windowArea.bottom - windowArea.top) ) * 2 + 1,
        0
      );
      const raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(mouse3D, this.camera);
      var intersects = raycaster.intersectObjects(tiles);

      if (intersects.length > 0) {
        let x = intersects[0].object.position.x;
        let y = intersects[0].object.position.y;
        socket.emit('tilePlaced', this.props.roomId, [x, y])
      }
    }
  }
  resetCamera () {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
    this.camera.lookAt(new THREE.Vector3(0,0, 0))
  }
  render() {
    return (
      <div>
        <button type="button" onClick={this.resetCamera}> Move Camera </button>
        <div
          onClick={e => this.onDocMouseDown(e, this.validTiles)}
          id="boardCanvas"
          style={{ width: "80vw", height: "40vw" }}
          ref={mount => {
            this.mount = mount;
          }}
        />
        <div id="currentTiles">
          {this.props.players.map(player => <CurrentTile key={player.name} player={player}/>)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    players: state.players,
    unfilledTiles: state.unfilledTiles,
    currentTile: state.curTile,
    startTile: state.startTile,
    curLocation: state.curLocation,
    roomId: state.roomId,
    currentPlayer: state.currentPlayer,
    player: state.player
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateBoard: (x,y) => dispatch(updateBoard(x,y))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
