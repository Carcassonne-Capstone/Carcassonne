import React, { Component } from "react";
import * as THREE from "three";
import { createCube, createBlankTile } from "./renderFuncs/createTile";
const OrbitControls = require("three-orbit-controls")(THREE);
//const MapControls = require("three-map-controls")(THREE);
import CurrentTile from "./CurrentTile";
import checkValid from "./renderFuncs/checkValid";
import { connect } from "react-redux";
import { updateBoard } from "../store";
import socket from "../socket";
import { createMeeple, createEmptyMeeple } from "./renderFuncs/createMeeple";
import { validMeepleRegion } from "./renderFuncs/checkValidMeeple";

class Board extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.changeCurTile = this.changeCurTile.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
    this.updateValidTiles = this.updateValidTiles.bind(this);
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
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.controlCenter = this.controls.center.clone();
    this.controlRotation = this.camera.rotation.clone();

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

    window.addEventListener("resize", this.onWindowResize, false);

    // var imagePrefix = "skybox2/";
    // var directions  = ["1", "2", "3", "4", "5", "6"];
    // var imageSuffix = ".png";

    // var materialArray = [];
    // for (var i = 0; i < 6; i++)
    //   materialArray.push( new THREE.MeshBasicMaterial({
    //   map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
    //   side: THREE.BackSide
    //   }));

    // var skyGeometry = new THREE.CubeGeometry( 1500, 1500, 1500 );
    // var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    // var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    // skyBox.rotation.x += Math.PI / 2;
    // this.scene.add( skyBox );
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTile.tile !== this.props.currentTile.tile) {
      this.emptyMeeples.forEach(meeple => {
        this.curTile.remove(meeple);
      });
      this.curTile = null;
    }
    if (prevProps.curLocation !== this.props.curLocation) {
      this.changeCurTile();
    }
    if (
      prevProps.unfilledTiles !== this.props.unfilledTiles ||
      prevProps.currentTile.rotation !== this.props.currentTile.rotation
    ) {
      this.updateValidTiles();
    }
    if (prevProps.meeple.coords !== this.props.meeple.coords) {
      this.changeMeeple();
    }
  }

  changeMeeple() {
    if (this.props.meeple.coords) {
      this.curTile.remove(this.meeple);
      this.meeple = createMeeple(
        this.props.meeple.coords[0],
        this.props.meeple.coords[1],
        this.props.meeple.player.color
      );
      this.curTile.add(this.meeple);
    }
  }

  changeCurTile() {
    if (this.curTile) {
      this.scene.remove(this.curTile);
    }
    if (this.props.curLocation) {
      this.curTile = createCube(
        this.props.currentTile,
        this.props.curLocation[0],
        this.props.curLocation[1]
      );
      this.emptyMeeples = [];
      this.props.currentTile.tile.regions.forEach((region, idx) => {
        if (validMeepleRegion(region, this.props.currentTile)) {
          if (region.meeplePosition) {
            let emptyMeeple = createEmptyMeeple(
              region.meeplePosition[0],
              region.meeplePosition[1]
            );
            emptyMeeple.regionIdx = idx;
            this.emptyMeeples.push(emptyMeeple);
            this.curTile.add(emptyMeeple);
          }
        }
      });

      this.scene.add(this.curTile);
    }
  }

  updateValidTiles() {
    this.validTiles.forEach(tile => this.scene.remove(tile));
    this.validTiles = [];
    const validLocations = checkValid(
      this.props.unfilledTiles,
      this.props.currentTile
    );
    for (let key in validLocations) {
      if (validLocations.hasOwnProperty(key)) {
        const coords = key.split(",");
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
    this.controls.mouseButtons = {
      ORBIT: THREE.MOUSE.RIGHT,
      ZOOM: THREE.MOUSE.MIDDLE,
      PAN: THREE.MOUSE.LEFT
    };
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
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
        ((event.clientX - windowArea.left) /
          (windowArea.right - windowArea.left)) *
          2 -
          1,
        -(
          (event.clientY - windowArea.top) /
          (windowArea.bottom - windowArea.top)
        ) *
          2 +
          1,
        0
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse3D, this.camera);
      const intersects = raycaster.intersectObjects(tiles);

      const intersectsMeeple = raycaster.intersectObjects(this.emptyMeeples);

      if (intersectsMeeple.length) {
        let x = intersectsMeeple[0].object.position.x;
        let y = intersectsMeeple[0].object.position.y;
        socket.emit(
          "meeplePlaced",
          this.props.roomId,
          [x, y],
          this.props.player,
          intersectsMeeple[0].object.regionIdx
        );
      } else if (intersects.length > 0) {
        let x = intersects[0].object.position.x;
        let y = intersects[0].object.position.y;
        socket.emit("tilePlaced", this.props.roomId, [x, y]);
      }
    }
  }
  resetCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls.center.set(
      this.controlCenter.x,
      this.controlCenter.y,
      this.controlCenter.z
    );
    this.camera.rotation.set(
      this.controlRotation.x,
      this.controlRotation.y,
      this.controlRotation.z
    );
  }

  threeDcamera() {
    this.camera.position.x = 0;
    this.camera.position.y = -6;
    this.camera.position.z = 2;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls.center.set(
      this.controlCenter.x,
      this.controlCenter.y,
      this.controlCenter.z
    );
  }
  render() {
    return (
      <div>
        <button type="button" onClick={this.resetCamera}>
          {" "}
          Flat Board{" "}
        </button>
        <button type="button" onClick={this.threeDcamera}>
          {" "}
          3D Board{" "}
        </button>
        <div
          onClick={e => this.onDocMouseDown(e, this.validTiles)}
          id="boardCanvas"
          style={{ width: "80vw", height: "30vw" }}
          ref={mount => {
            this.mount = mount;
          }}
        />
        <div id="currentTiles">
          {this.props.players.map(player => (
            <CurrentTile key={player.name} player={player} />
          ))}
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
    board: state.board
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBoard: (x, y) => dispatch(updateBoard(x, y))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
