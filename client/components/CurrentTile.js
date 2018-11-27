import React, { Component } from "react";
import * as THREE from "three";
import { createCube } from "./renderFuncs/createTile";
import { connect } from "react-redux";
import socket from "../socket";

class CurrentTile extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.addCube = this.addCube.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.nextPlayer = this.nextPlayer.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  onWindowResize() {
    //this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if(this.mount!==null){
      this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    }
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x000000); //ace4fb
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // this.renderer = new THREE.WebGLRenderer({ antialias: true }, {alpha: true});
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setClearColor( 0x000000, 0 );

    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.initializeCamera();
    this.addCube();
    this.animate();

    window.addEventListener("resize", this.onWindowResize, false);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.curTile !== this.props.curTile || prevProps.curLocation !== this.props.curLocation) {
      this.addCube();
    }
  }

  initializeCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  addCube() {
    this.scene.remove(this.cube);
    if (this.props.curLocation === null) {
      this.cube = createCube(this.props.curTile, 0, 0, false);
      this.scene.add(this.cube);
    }
  }

  nextPlayer() {
    socket.emit("turnEnded", this.props.currentPlayer, this.props.players, this.props.roomId);
  }

  render() {
    return (
      <div className="playerTile">
        {this.props.me.name === this.props.currentPlayer.name ?
          <div className="playerButtons">
            {
              this.props.curLocation ?
              <button type="button" onClick={() => socket.emit('tilePlaced', this.props.roomId, null)}> Back </button> :
              <button type="button" onClick={() => socket.emit('rotateTile', this.props.roomId)}>Rotate</button>
            }
              <button
                type="button"
                onClick={this.nextPlayer}
                disabled={this.props.curLocation === null}
              >
                End Turn
              </button>
          </div>
          : (
            <div id="notPlayer" />
          )}

        <div
          id="playerCurrentTile"
          //style={{ width: '15vw', height: '12vw' }}
          ref={(mount) => { this.mount = mount }}
        />

        {this.props.me.name === this.props.currentPlayer.name ?
        <div className='currentPlayer'>It's your turn!</div>:
        <div className='currentPlayer'>{`It's ${this.props.currentPlayer.name}'s turn!`}</div>
      }
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    curTile: state.game.curTile,
    currentPlayer: state.game.currentPlayer,
    players: state.game.players,
    roomId: state.game.roomId,
    curLocation: state.game.curLocation,
    me: state.game.player
  };
};

export default connect(mapStateToProps)(CurrentTile);
