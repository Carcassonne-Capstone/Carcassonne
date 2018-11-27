import {createMeeple, createEmptyMeeple} from './createMeeple'
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

export const changeMeeple = (meeple, prevMeeple, tile, animal) => {
    if (meeple.coords) {
        if (prevMeeple.coords) {
            const oldMeeple = tile.getObjectByName(`meeple-${prevMeeple.coords[0]},${prevMeeple.coords[1]}`)
            replaceMeeple(tile, oldMeeple, createEmptyMeeple(prevMeeple.coords[0], prevMeeple.coords[1], prevMeeple.regionIdx, tile))
        }
        const old = tile.getObjectByName(`emptyMeeple-${meeple.coords[0]},${meeple.coords[1]}`)
        //const newMeeple = animal(meeple.coords[0], meeple.coords[1], meeple.player.color, meeple.player.sound)
        const file = `/animals/models/${animal}.json`
        const objLoader = new THREE.ObjectLoader();
        objLoader.load(file, (object) => {
            const data = getModelData(animal)
            object.position.x=meeple.coords[0];
            object.position.y=meeple.coords[1];
            object.position.z= data.posZ;
            object.scale.x=data.scaleX;
            object.scale.y=data.scaleY;
            object.scale.z=data.scaleZ;
            object.rotation.x = data.rotX;
            object.rotation.y = data.rotY;
            object.name = `meeple-${meeple.coords[0]},${meeple.coords[1]}`
            object.soundEffect= `animals/Sounds/${animal}.mp3`;
            replaceMeeple(tile, old, object)
        });
    }
}

const getModelData = (animal) => {
    switch(animal) {
        case 'tiger':
            return {
                posZ: .25,
                scaleX:.003,
                scaleY:.003,
                scaleZ:.003,
                rotX: Math.PI/2,
                rotY: Math.PI/2
            }
        case 'gorilla':
            return {
                posZ: .05,
                scaleX:.003,
                scaleY:.003,
                scaleZ:.003,
                rotX: Math.PI,
                rotY: Math.PI
            }   
        case 'elephant':
            return {
                posZ: .05,
                scaleX:.0015,
                scaleY:.0015,
                scaleZ:.0015,
                rotX: Math.PI,
                rotY: Math.PI
            } 
        case 'monkey':
            return {
                posZ: .05,
                scaleX:.006,
                scaleY:.006,
                scaleZ:.006,
                rotX: Math.PI,
                rotY: Math.PI
            }      
       
        case 'lion':
            return {
                posZ: .05,
                scaleX:.004,
                scaleY:.004,
                scaleZ:.004,
                rotX: Math.PI,
                rotY: Math.PI
            }     
        }
}

