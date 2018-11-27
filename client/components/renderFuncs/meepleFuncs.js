import {createMeeple, animal, createEmptyMeeple} from './createMeeple'
import * as THREE from "three";

const replaceMeeple = (tile, prevMeeple, newMeeple) => {
    tile.remove(prevMeeple);
    tile.add(newMeeple);
    const sound = new Audio(newMeeple.soundEffect);
    sound.play();
}

export const removeMeeples = (meeplesToRemove, scene) => {
    meeplesToRemove.forEach(meeple => {
      const tile = scene.getObjectByName(meeple.tile.object.name);
      const curMeeple = tile.getObjectByName(`meeple-${meeple.coords[0]},${meeple.coords[1]}`);
      tile.remove(curMeeple);
    });
}

export const changeMeeple = (meeple, prevMeeple, tile) => {
    if (meeple.coords) {
        if (prevMeeple.coords) {
            const oldMeeple = tile.getObjectByName(`meeple-${prevMeeple.coords[0]},${prevMeeple.coords[1]}`)
            replaceMeeple(tile, oldMeeple, createEmptyMeeple(prevMeeple.coords[0], prevMeeple.coords[1], prevMeeple.regionIdx, tile))
        }
        const old = tile.getObjectByName(`emptyMeeple-${meeple.coords[0]},${meeple.coords[1]}`)
        //const newMeeple = animal(meeple.coords[0], meeple.coords[1], meeple.player.color, meeple.player.sound)
        const objLoader = new THREE.ObjectLoader();
        objLoader.load('/animals/tiger.json', (object) => {
        object.position.x=meeple.coords[0];
        object.position.y=meeple.coords[1];
        object.position.z=.25;
        object.scale.x=.003;
        object.scale.y=.003;
        object.scale.z=.003;
        object.rotation.x = Math.PI / 2;
        object.rotation.y = Math.PI / 2;
        object.name = `meeple-${meeple.coords[0]},${meeple.coords[1]}`
        object.soundEffect= meeple.player.sound;
        replaceMeeple(tile, old, object)
        });
    }
}