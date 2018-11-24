import * as THREE from "three";
import {validMeepleRegion} from './checkValidMeeple'
import {createEmptyMeeple} from './createMeeple'

export const createCube = (tileNode, x, y, addEmptyMeeples) => {
  const tile = tileNode.tile
  const tileImgSrc = `/images/${tile.id}.png`;
  const texture = new THREE.TextureLoader().load(tileImgSrc);
  const back = new THREE.TextureLoader().load("/images/back.jpg");
  const materials = [
    new THREE.MeshBasicMaterial({
      color: 0x6e9329
    }),
    new THREE.MeshBasicMaterial({
      color: 0x6e9329
    }),
    new THREE.MeshBasicMaterial({
      color: 0x6e9329
    }),
    new THREE.MeshBasicMaterial({
      color: 0x6e9329
    }),
    new THREE.MeshBasicMaterial({
      map: texture
    }),
    new THREE.MeshBasicMaterial({
      map: back
    })
  ];
  var cubeGeo = new THREE.CubeGeometry(1, 1, 0.1);
  let cube = new THREE.Mesh(cubeGeo, materials);
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = 0;
  cube.rotation.z = -Math.PI / 2 * tileNode.rotation;
  cube.name = `tile-${x},${y}`

  if (addEmptyMeeples) {
    tile.regions.forEach((region, idx) => {
      if (validMeepleRegion(region, tileNode)) {
        if (region.meeplePosition) {
          const emptyMeeple = createEmptyMeeple(region.meeplePosition[0], region.meeplePosition[1], idx, cube);
          cube.add(emptyMeeple);
        }
      }
    });
  }

  return cube;
};

export const createBlankTile = (tile, x, y) => {
  const newCube = new THREE.CubeGeometry(1, 1, 0.1);
  let material = new THREE.MeshBasicMaterial({ color: 0xa9b6cc });
  let cube = new THREE.Mesh(newCube, material);
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = 0;
  cube.name = `emptyTile-${x},${y}`
  return cube;
};
