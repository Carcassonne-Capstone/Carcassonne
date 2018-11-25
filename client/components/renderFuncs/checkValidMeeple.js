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
    const block = blocksToCheck.shift();
    visitedTiles.add(block.tileNode);
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
