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
import Chat from "./Chat"

class Board extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
    this.threeDcamera = this.threeDcamera.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.state = {
      directionsToggle:false,
      currentHover: {}
    }
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

  // eslint-disable-next-line complexity
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
      changeMeeple(this.props.meeple, prevProps.meeple, this.curTile, this.props.currentPlayer.animal)
    }
    if (this.props.playingWithBots || prevProps.currentPlayer.name !== this.props.currentPlayer.name) {
      this.checkPlayerBotTurn()
    }
  }
  
  checkPlayerBotTurn() {
    if (this.props.disconnectedPlayers.find(player => player === this.props.currentPlayer.name) && this.props.player.host) {
      if (this.props.meeple.coords) {
        setTimeout(() => socket.emit('turnEnded', this.props.currentPlayer, this.props.players, this.props.roomId), 1200);
      } else if (this.props.curLocation) {
        const tile = this.scene.getObjectByName(`tile-${this.props.curLocation[0]},${this.props.curLocation[1]}`)
        const filteredChildren = tile.children.filter(child => child.name.split('-')[0] === 'emptyMeeple')
        if (filteredChildren.length > 0) {
          const randMeeple = filteredChildren[Math.floor(Math.random() * filteredChildren.length)]
          setTimeout(() => socket.emit('meeplePlaced', this.props.roomId, [randMeeple.position.x, randMeeple.position.y], this.props.player, randMeeple.regionIdx, randMeeple.tile), 1500)
        } else {
          setTimeout(() => socket.emit('turnEnded', this.props.currentPlayer, this.props.players, this.props.roomId), 1200);
        }
      } else if (this.validTiles.length) {
        const randTile = this.validTiles[Math.floor(Math.random()*this.validTiles.length)]
        setTimeout(() => socket.emit('tilePlaced', this.props.roomId, [randTile.position.x, randTile.position.y]), 1500)
      } else {
        setTimeout(() => socket.emit('rotateTile', this.props.roomId), 1200)
      }
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
          <div className="instructions">
            <div className='drag'>Drag mouse to move board, right click and drag to rotate, scroll to zoom in/out</div>
              <div id="cameraButtons">
                <div >Change Camera View:</div>
                <button type="button" onClick={this.resetCamera}>
                  Flat Board
                </button>
                <button type="button" onClick={this.threeDcamera}>
                  3D Board
                </button>
              </div>
            </div>
            <div className="tileInstructions">
              <div className="helpButton">
                <img src="/helpButton.svg" style={{ width: "60px", height: "60px" }} onClick={()=>this.setState({directionsToggle: true})}/>
                {this.state.directionsToggle === true ?
                  <div className="directionsModal">
                    <div id="directions">
                      <div className="directions-modal-content">
                        <button id="exitOut" onClick={()=>this.setState({directionsToggle: false})} type="button">X</button>
                      </div> 
                    </div>
                  </div>:
                  ``
                }
              </div>
              <div className="tileRemain">{`Tiles Remaining: ${this.props.numTiles < 9 ? 0 : ''}${this.props.numTiles + 1}`}</div>
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
              <CurrentTile />
            </div>
          </div>
        </div>
        <div className="rightSide">
          <ScoreBoard />
          <Chat />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    players: state.game.players,
    unfilledTiles: state.game.unfilledTiles,
    currentTile: state.game.curTile,
    startTile: state.game.startTile,
    curLocation: state.game.curLocation,
    roomId: state.game.roomId,
    currentPlayer: state.game.currentPlayer,
    player: state.game.player,
    meeple: state.game.curMeeple,
    removeMeeples: state.game.removeMeeples,
    gameState: state.game.gameState,
    disconnectedPlayers: state.messages.disconnectedPlayers,
    playingWithBots: state.messages.playingWithBots,
    numTiles: state.game.numTiles
  };
};

export default connect(mapStateToProps)(Board);
