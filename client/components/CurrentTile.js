import React, { Component } from "react";
import * as THREE from "three";
import { createCube } from "./renderFuncs/createTile";
import { connect } from "react-redux";
import { rotate } from "../store";
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
    this.scene.background = new THREE.Color(0x000000); //ace4fb
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

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
    if (
      prevProps.curTile !== this.props.curTile ||
      prevProps.currentPlayer.name !== this.props.currentPlayer.name ||
      prevProps.curLocation !== this.props.curLocation
    ) {
      this.addCube();
    }
  }

  initializeCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = .75;
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  addCube() {
    this.scene.remove(this.cube);
    if (
      this.props.player.name === this.props.currentPlayer.name &&
      this.props.curLocation === null
    ) {
      this.cube = createCube(this.props.curTile, 0, 0);
      this.scene.add(this.cube);
    }
  }

  nextPlayer() {
    socket.emit(
      "turnEnded",
      this.props.currentPlayer,
      this.props.players,
      this.props.roomId
    );
  }

  render() {
    // const meepleCount = this.props.player.meeple;
    // const meepleArr = new Array(meepleCount).fill("placeholder");
    return (
      <div className="playerTile">
      <div
          id="playerCurrentTile"
          //style={{ width: '15vw', height: '12vw' }}
          ref={(mount) => { this.mount = mount }}
      />
        {this.props.me.name === this.props.currentPlayer.name ?
          this.props.currentPlayer.name === this.props.player.name ?
            <div className="playerButtons">
              {
                this.props.curLocation ?
                <button type="button" onClick={() => socket.emit('tilePlaced', this.props.roomId, null)}> Back </button> :
                // <button type="button" onClick={this.props.rotate}>Rotate</button>
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
                <div className="playerButtons" />
              )
            : (
              <div id="notPlayer" />
            )}

        {this.props.me.name === this.props.currentPlayer.name && this.props.currentPlayer.name === this.props.player.name ?
        <div>It's your turn!</div>:
        <div>{`It's ${this.props.currentPlayer.name}'s turn!`}</div>
      }
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    curTile: state.curTile,
    currentPlayer: state.currentPlayer,
    players: state.players,
    roomId: state.roomId,
    curLocation: state.curLocation,
    me: state.player
  };
};

const mapDispatchToProps = dispatch => {
  return {
    rotate: () => dispatch(rotate())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentTile);
