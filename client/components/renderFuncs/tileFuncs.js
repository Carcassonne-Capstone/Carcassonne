import {createCube, createBlankTile} from './createTile'
import checkValid from './checkValid'

export const changeCurTile = (scene, curTile, curLocation, tileNode, meeple, currPlayer) => {
    if (curTile) {
      scene.remove(curTile);
    }
    if (curLocation) {
        const newTile = createCube(tileNode, curLocation[0], curLocation[1], (currPlayer.meeple > 0 || meeple.coords));
        scene.add(newTile);
        return newTile
    }
}

export const updateValidTiles = (validTiles, scene, unfilledTiles, currentTile) => {
    validTiles.forEach(tile => scene.remove(tile));
    let newValidTiles = [];
    const validLocations = checkValid(unfilledTiles, currentTile);
    for (let key in validLocations) {
      if (validLocations.hasOwnProperty(key)) {
        const coords = key.split(',');
        const x = parseInt(coords[0], 10);
        const y = parseInt(coords[1], 10);
        const validSpot = createBlankTile(null, x, y);
        newValidTiles.push(validSpot);
        scene.add(validSpot);
      }
    }
    return newValidTiles;
}
