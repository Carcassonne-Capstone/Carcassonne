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

export const changeMeeple = (meeple, prevMeeple, tile, animal, tileNode) => {
    if (meeple.coords) {
        if (prevMeeple.coords) {
            const oldMeeple = tile.getObjectByName(`meeple-${prevMeeple.coords[0]},${prevMeeple.coords[1]}`)
            replaceMeeple(tile, oldMeeple, createEmptyMeeple(prevMeeple.coords[0], prevMeeple.coords[1], prevMeeple.regionIdx, tile, tileNode.tile.regions[prevMeeple.regionIdx].type))
        }
        const old = tile.getObjectByName(`emptyMeeple-${meeple.coords[0]},${meeple.coords[1]}`)
        let addZ = 0;
        if (tileNode.tile.regions[meeple.regionIdx].type === 'monastery') addZ = -0.09
        else if (tileNode.tile.regions[meeple.regionIdx].type === 'city') addZ = 0.4
        const file = `/animals/models/${animal}.json`
        const objLoader = new THREE.ObjectLoader();
        objLoader.load(file, (object) => {
            const data = getModelData(animal)
            object.position.x=meeple.coords[0];
            object.position.y=meeple.coords[1];
            object.position.z= data.posZ + addZ;
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
                posZ: .05,
                scaleX:.03,
                scaleY:.03,
                scaleZ:.03,
                rotX: Math.PI/2,
                rotY: Math.PI
            }
        case 'gorilla':
            return {
                posZ: .25,
                scaleX:.0023,
                scaleY:.0023,
                scaleZ:.0023,
                rotX: Math.PI/2,
                rotY: Math.PI
            }   
        case 'elephant':
            return {
                posZ: .05,
                scaleX:.0014,
                scaleY:.0014,
                scaleZ:.0014,
                rotX: Math.PI / 2,
                rotY: Math.PI
            } 
        case 'monkey':
            return {
                posZ: .05,
                scaleX:.1,
                scaleY:.07,
                scaleZ:.07,
                rotX: Math.PI/2,
                rotY: Math.PI
            }      
       
        case 'lion':
            return {
                posZ: .05,
                scaleX:.06,
                scaleY:.04,
                scaleZ:.04,
                rotX: Math.PI/2,
                rotY: Math.PI
            }     
        }
}

