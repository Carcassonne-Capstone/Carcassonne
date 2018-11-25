import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import * as THREE from "three";
import { createCube, createBlankTile } from "./renderFuncs/createTile";
const OrbitControls = require("three-orbit-controls")(THREE);
//const MapControls = require("three-map-controls")(THREE);
import CurrentTile from "./CurrentTile";
import { connect } from "react-redux";
import socket from "../socket";
import {changeMeeple, removeMeeples} from './renderFuncs/meepleFuncs'
import {changeCurTile, updateValidTiles} from './renderFuncs/tileFuncs'
import ScoreBoard from "./ScoreBoard";

class Board extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
    this.threeDcamera = this.threeDcamera.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  onWindowResize() {
    //this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.controlCenter = this.controls.center.clone();
    this.controlRotation = this.camera.rotation.clone();

    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    this.initializeOrbits();
    this.initializeCamera();

    this.scene.add(createCube(this.props.startTile, 0, 0, false));
    this.curTile = null;

    this.validTiles = updateValidTiles([], this.scene, this.props.unfilledTiles, this.props.currentTile);
    this.animate();

    window.addEventListener("resize", this.onWindowResize, false);

    var imagePrefix = "img/";
    var directions  = ["1", "2", "3", "4", "5", "6"];
    var imageSuffix = ".png";

    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push( new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide
      }));

    var skyGeometry = new THREE.CubeGeometry( 2000, 2000, 2000 );
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    this.scene.add( skyBox );
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    // this.mount.removeChild(this.renderer.domElement);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.removeMeeples !== this.props.removeMeeples) {
      removeMeeples(this.props.removeMeeples, this.scene)
    }
    if (prevProps.currentTile.tile !== this.props.currentTile.tile) {
      [...this.curTile.children].forEach(meeple => {
        if (meeple.name.split('-')[0] === 'emptyMeeple') {
          this.curTile.remove(meeple);
        }
      });
      this.curTile = null;
    }
    if (prevProps.curLocation !== this.props.curLocation) {
      const currPlayer = this.props.players.find(player => player.name === this.props.currentPlayer.name);
      this.curTile = changeCurTile(this.scene, this.curTile, this.props.curLocation, this.props.currentTile, this.props.meeple, currPlayer)
    }
    if (prevProps.unfilledTiles !== this.props.unfilledTiles || prevProps.currentTile.rotation !== this.props.currentTile.rotation) {
      this.validTiles = updateValidTiles(this.validTiles, this.scene, this.props.unfilledTiles, this.props.currentTile);
    }
    if (prevProps.meeple.coords !== this.props.meeple.coords) {
      changeMeeple(this.props.meeple, prevProps.meeple, this.curTile)
    }
  }
  
  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  initializeOrbits() {
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.mouseButtons = {ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT};
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI * 2;
  }

  setCameraPosition(x, y, z) {
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
  }

  initializeCamera() {
    this.setCameraPosition(0, 0, 4)
  }

  resetCamera() {
    this.setCameraPosition(0, 0, 4)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls.center.set(this.controlCenter.x, this.controlCenter.y, this.controlCenter.z);
    this.camera.rotation.set(this.controlRotation.x, this.controlRotation.y,this.controlRotation.z);
  }
  
  threeDcamera() {
    this.setCameraPosition(0, -5, 2)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls.center.set(this.controlCenter.x, this.controlCenter.y, this.controlCenter.z);
  }

  onDocMouseDown(event, tiles) {
    if (this.props.currentPlayer.name === this.props.player.name) {
      const windowArea = event.target.getBoundingClientRect();
      const mouse3D = new THREE.Vector3(
        ((event.clientX - windowArea.left) / (windowArea.right - windowArea.left)) * 2 - 1,
        -((event.clientY - windowArea.top) / (windowArea.bottom - windowArea.top)) * 2 + 1,
        0
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse3D, this.camera);
      const intersects = raycaster.intersectObjects(tiles);

      let intersectsMeeple = false;
      if (this.props.curLocation) {
        const tile = this.scene.getObjectByName(`tile-${this.props.curLocation[0]},${this.props.curLocation[1]}`)
        const filteredChildren = tile.children.filter(child => child.name.split('-')[0] === 'emptyMeeple')
        intersectsMeeple = raycaster.intersectObjects(filteredChildren);
      }

      if (intersectsMeeple.length) {
        let x = intersectsMeeple[0].object.position.x;
        let y = intersectsMeeple[0].object.position.y;
        socket.emit('meeplePlaced', this.props.roomId, [x, y], this.props.player, intersectsMeeple[0].object.regionIdx, intersectsMeeple[0].object.tile);
      } else if (intersects.length > 0) {
        let x = intersects[0].object.position.x;
        let y = intersects[0].object.position.y;
        if (!this.props.curLocation || x !== this.props.curLocation[0] || y !== this.props.curLocation[1]) {
          socket.emit('tilePlaced', this.props.roomId, [x, y]);
        }
      }
    }
  }
  
  render() {
    return this.props.gameState === "gameOver" ? (
      <Redirect to="/gameOver" />
      ) : (
        <div className="gameBoard">
        <div className="leftSide">
          <div className="gameButtons"
            //style={{ width: "80vw", height: "5vw" }}
          > 
            <div id="cameraButtons">
              <div className="instructions">Change Camera View:</div>
              <button type="button" onClick={this.resetCamera}>
                {" "}
                Flat Board{" "}
              </button>
              <button type="button" onClick={this.threeDcamera}>
                {" "}
                3D Board{" "}
              </button>
            </div>
            <div className="instructions">
              Drag mouse to move board, right click and drag to rotate, scroll to zoom in/out
            </div>
          </div>

          <div
            onClick={e => this.onDocMouseDown(e, this.validTiles)}
            id="boardCanvas"
            //style={{ width: "80vw", height: "40vw" }}
            ref={mount => {
              this.mount = mount;
            }}
          />
          <div className="playerContainer">
            <div className="currentTiles">
              {this.props.players.map(player => (
                player.name === this.props.currentPlayer.name ?
                <CurrentTile key={player.name} player={player} /> 
                :
                <div key={player.name} className="notPlayerTile"></div>
              ))}
            </div>

            <div className="playerMat">
              {this.props.players.map(player => (
                <div id="playerTitle" key={player.name}>
                  <div id="playerName">{player.name}</div>
                  <div id="meeple"> 
                    <img src='/images/meeple.png'/>
                    {`x${player.meeple}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rightSide">
          <ScoreBoard />
          <div className="chat">CHAT</div>
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
    player: state.player,
    meeple: state.curMeeple,
    removeMeeples: state.removeMeeples,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(Board);
