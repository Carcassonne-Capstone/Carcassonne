import * as THREE from "three";
import {validMeepleRegion} from './checkValidMeeple'
import {createEmptyMeeple} from './createMeeple'
// import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import GLTFLoader from 'three-gltf-loader';



// mtlLoader.load('/models/tree/materials.mtl', (materials) => {
//   materials.preload()
//   objLoader.setMaterials(materials)
//   objLoader.load('/models/tree/tree.obj', (object) => {
//     object.position.x=0;
//     object.position.y=0;
    
//     return object
//   })
// })

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

  let mtlLoader = new THREE.MTLLoader();

  mtlLoader.load('/models/tree/materials.mtl', (materials) => {
    console.log('MATERIALS', materials)
    materials[0].preload()
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials[0])
    objLoader.load('/models/tree/tree.obj', (object) => {
      object.position.x=0;
      object.position.y=0;
      object.position.z=.2;
      object.scale.x=.1;
      object.scale.y=.1;
      object.scale.z=.1;
      object.rotation.x = Math.PI / 2;
      console.log('MATERIALS2', materials)
      console.log('objects', object)
      cube.add(object)
    })
  })

  // const loader = new GLTFLoader();

  // loader.load('/models/treeGltf/model.gltf', (object) => {
  //       object.position.x=0;
  //       object.position.y=0;
  //       object.position.z=.2;
  //       object.scale.x=.1;
  //       object.scale.y=.1;
  //       object.scale.z=.1;
  //       object.rotation.x = Math.PI / 2;
        
  //       console.log('object', object)
  //       cube.add(object)
  //   })

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
