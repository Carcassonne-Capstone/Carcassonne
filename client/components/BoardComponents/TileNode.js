const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

class TileNode {
    constructor(tile) {
        this.tile = tile
        this.rotation = 0
        this.neighbors = {
            [top]: null,
            [right]: null,
            [bottom]: null,
            [left]: null
        }
    }

    setNeighbor(direction, tile) {
        this.neighbors[direction] = tile
    }

    findOppEdge(edge) {
        switch(parseInt(edge, 10)) {
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
}

export default TileNode;