import { findRegion } from "./checkValid";

export const validMeepleRegion = (region, currentTile) => {
  const visitedTiles = new Set();
  const blocksToCheck = [];
  for (let i = 0; i < region.edges.length; i++) {
    let neighbor = currentTile.neighbors[region.edges[i]];
    if (neighbor) {
      let oppEdge = currentTile.findOppEdge(region.edges[i]);
      blocksToCheck.push({ tileNode: neighbor, edge: oppEdge });
    }
  }
  while (blocksToCheck.length) {
    const block = blocksToCheck.pop();
    visitedTiles.add(block.tileNode);
    console.log(block.tileNode);
    const curRegion = findRegion(block.tileNode.tile, block.edge);
    if (curRegion.meeple && curRegion.meeple.length) return false;
    curRegion.edges.forEach(edge => {
      if (edge !== block.edge) {
        const neighbor = block.tileNode.neighbors[edge];
        if (neighbor && !visitedTiles.has(neighbor)) {
          const oppEdge = block.tileNode.findOppEdge(edge);
          blocksToCheck.push({ tileNode: neighbor, edge: oppEdge });
        }
      }
    });
  }
  return true;
};

// const xDirs = [0, 1, 0, -1];
// const yDirs = [1, 0, -1, 0];
// const validRegions = [];

// for (let i = 0; i < 4; i++) {
//   if (
//     board.hasOwnProperty(`${xDirs[i] + coords[0]},${yDirs[i] + coords[1]}`)
//   ) {
//     let oppositeDir = currentTile.findOppEdge(i);

//     let meepleType = null;
//     console.log(
//       board[`${xDirs[i] + coords[0]},${yDirs[i] + coords[1]}`].tile.regions
//     );

//     //   board[
//     //     `${xDirs[i] + coords[0]},${yDirs[i] + coords[1]}`
//     //   ].tile.regions.forEach(region => {
//     //     region.edges.forEach(dir => {
//     //       if (parseInt(dir, 10) === parseInt(oppositeDir, 10)) {
//     //         meepleType = region.meeple;
//     //       }
//     //     });
//     //   });

//     if (meepleType.length === 0) {
//       // validRegions.push();
//       return false;
//     }
//   }
// }
