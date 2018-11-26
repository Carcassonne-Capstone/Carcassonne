import {createMeeple, createEmptyMeeple} from './createMeeple'

const replaceMeeple = (tile, prevMeeple, newMeeple) => {
    tile.remove(prevMeeple);
    tile.add(newMeeple);
    console.log("in new meeple", newMeeple)
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
        const newMeeple = createMeeple(meeple.coords[0], meeple.coords[1], meeple.player.color, meeple.player.sound)
        replaceMeeple(tile, old, newMeeple)
    }
}