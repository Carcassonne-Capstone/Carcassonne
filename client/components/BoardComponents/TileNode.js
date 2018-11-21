const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

class TileNode {
  constructor(tile) {
    this.tile = tile;
    this.rotation = 0;
    this.neighbors = {
      [top]: null,
      [right]: null,
      [bottom]: null,
      [left]: null
    };
  }

  setNeighbor(direction, tile) {
    this.neighbors[direction] = tile;
  }

  resetNeighbors() {
    this.neighbors = {
      [top]: null,
      [right]: null,
      [bottom]: null,
      [left]: null
    };
  }

  findOppEdge(edge) {
    switch (parseInt(edge, 10)) {
      case top:
        return bottom;
      case right:
        return left;
      case bottom:
        return top;
      case left:
        return right;
    }
  }

  rotate() {
    if (this.rotation === 3) this.rotation = 0;
    else this.rotation++;
    for (let i = 0; i < this.tile.regions.length; i++) {
      for (let j = 0; j < this.tile.regions[i].edges.length; j++) {
        if (this.tile.regions[i].edges[j] === 3)
          this.tile.regions[i].edges[j] = 0;
        else this.tile.regions[i].edges[j]++;
      }
    }
  }
}

export default TileNode;
