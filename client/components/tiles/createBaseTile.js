import * as THREE from "three";
import tileInfo from './allLocations'

const createBaseTile = (tileId) => {
    const baseImg = tileInfo[tileId][`baseImg${tileId}`]
    const treeLocations = tileInfo[tileId][`treeLocations${tileId}`]
    const hasMonastery = tileInfo[tileId][`hasMonastery${tileId}`]
    const texture = new THREE.TextureLoader().load(baseImg);
    const back = new THREE.TextureLoader().load("/images/back.jpg");
    const materials = [
        new THREE.MeshBasicMaterial({
        color: 0x7f644c
        }),
        new THREE.MeshBasicMaterial({
        color: 0x7f644c
        }),
        new THREE.MeshBasicMaterial({
        color: 0x7f644c
        }),
        new THREE.MeshBasicMaterial({
        color: 0x7f644c
        }),
        new THREE.MeshBasicMaterial({
        map: texture
        }),
        new THREE.MeshBasicMaterial({
        map: back
        })
    ];
    const cubeGeo = new THREE.CubeGeometry(1, 1, 0.1);
    const cube = new THREE.Mesh(cubeGeo, materials);

    const objLoader = new THREE.ObjectLoader();

    treeLocations.forEach(location => {
        objLoader.load('/models/tree/tree-toon.json', (object) => {
        object.position.x=location[0];
        object.position.y=location[1];
        object.position.z=.05;
        object.scale.x=.05;
        object.scale.y=.1;
        object.scale.z=.05;
        object.rotation.x = Math.PI / 2;
        cube.add(object)
        })
    })

    if (hasMonastery) {
        objLoader.load('/models/volcano/volcano.json', (object) => {
        object.position.x=0;
        object.position.y=-0.1;
        object.position.z=.25;
        object.scale.x=2.5;
        object.scale.y=2.5;
        object.scale.z=2.5;
        object.rotation.x = Math.PI / 2;
        object.rotation.y = Math.PI / 2;
        cube.add(object)
        })
    }

    return cube
}

export default createBaseTile