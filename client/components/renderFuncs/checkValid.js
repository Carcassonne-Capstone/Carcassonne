const top = 0;
const right = 1;
const bottom = 2;
const left = 3;
const road = 'road';
const monastery = 'monastery';
const city = 'city';

const checkEdgeForField = (tile) => {
  const results = [];
  for (let i=0; i< 4; i++) {
    let result = false;
    tile.regions.map(region => {
      region.edges.map(edge=> {
        if (edge === i) {
          result = true;
        }
      })
    })
    results.push(result);
  }
  
  if (results.includes(false)) {
    const fieldIdx = [];
    results.map((result, i) => {
      if (result === false) {
        fieldIdx.push(i);
      }
    });
    tile.regions.push({type: 'field', edges: fieldIdx, hasShield: false})
  }
  return tile;
}

const findEdgeType = (tile, direction) => {

    let regionType = null
    tile.regions.forEach(region => {
        region.edges.forEach(dir => {
            if (parseInt(dir, 10) === parseInt(direction, 10)) {
                regionType = region.type;
            }
        })
    })
    return regionType
}

const isValid = (tileNode, tileToPlace) => {
    const neighbors = tileNode.neighbors;
    checkEdgeForField(tileToPlace.tile);
    let validTile = true;
    for (let direction in neighbors) {
        if (neighbors.hasOwnProperty(direction)) {
            if (neighbors[direction]) {
                const curNeighbor = neighbors[direction].tile;
                checkEdgeForField(curNeighbor)
                const oppEdge = tileNode.findOppEdge(direction);
                if (findEdgeType(curNeighbor, parseInt(oppEdge, 10)) !== findEdgeType(tileToPlace.tile, parseInt(direction, 10))) {
                    validTile = false;
                    break;
                }
            }
        }
    }
    return validTile
}

const checkValid = (unfilteredObj, tileToPlace) => {

    const returnObj = {};
    for (let key in unfilteredObj) {
        if (unfilteredObj.hasOwnProperty(key)) {
            if (isValid(unfilteredObj[key], tileToPlace)) {
                returnObj[key] = unfilteredObj[key]
            }
        }
    }

    return returnObj;
}

export default checkValid;
    