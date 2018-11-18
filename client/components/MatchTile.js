const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

const tileToPlace = {
    id: 0,
    regions: [
              {type: city,
                  edges: [top],
                hasShield:false
              },
              {type: road,
                edges: [right, left],
              hasShield:false
            }]
    }

const boardTile = {
    id: 0,
    regions: [
              {type: city,
                  edges: [top],
                hasShield:false
              },
              {type: road,
                edges: [right, left],
              hasShield:false
            }]
}

const findOppEdge = {
    top: bottom,
    right: left,
    bottom: top,
    left: right
}

constMatchEdge = (tileToPlace, boardTile) => {
    const matchingEdges = [];
    tileToPlace.regions.map(region => {
        region.edges.map (edge => {
            const opp = findOppEdge[edge];
            boardTile.regions(boardRegion => {
                if (boardRegion.type === region.type) {
                    if (boardRegion.edges.includes(opp)) {
                        matchingEdges.push({[region.type]: opp})
                    }
                }
            })
        })
    })
    return matchingEdges;
}