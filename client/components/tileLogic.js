const tileLogic = () => {
const top = 0;
const right = 1;
const bottom = 2;
const left = 3;
const road = 'road';
const monastery = 'monastery';
const city = 'city';

// const tileToPlace = {
//     id: 0,
//     regions: [
//               {type: city,
//                   edges: [top],
//                 hasShield:false
//               },
//               {type: road,
//                 edges: [right, left],
//               hasShield:false
//             }]
//     }

    const tileToPlace2 = {
    id: 0,
    regions: [
              {type: road,
                edges: [right],
              hasShield:false
            }, 
            {type: road,
                edges: [left],
              hasShield:false
            },
            {type: road,
                edges: [bottom],
              hasShield:false
            }]
    }
    const tileToPlace3 = {
    id: 0,
    regions: [
              {type: city,
                edges: [right, left, top, bottom],
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
    0: 2,
    1: 3,
    2: 0,
    3: 1
}

const matchEdge = (tileToPlace2, boardTile) => {
    const matchingEdges = [];
    checkEdgeForField(tileToPlace2)
    checkEdgeForField(boardTile)
    tileToPlace2.regions.map(region => {
        region.edges.map (edge => {
            const opp = findOppEdge[edge];
            boardTile.regions.map(boardRegion => {
                if (boardRegion.type === region.type) {
                    if (boardRegion.edges.includes(opp)) {
                        matchingEdges.push(opp);
                    }
                }
            })
        })
    })
    return matchingEdges;
}

const checkEdgeForField = (tileToPlace2) => {
  const results = [];
  for (let i=0; i< 4; i++) {
    let result = false;
    tileToPlace2.regions.map(region => {
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
    tileToPlace2.regions.push({type: 'field', edges: fieldIdx, hasShield: false})
  }
  return tileToPlace2;
}
return coordinates(matchEdge(tileToPlace, boardTile));
}
const coordinates = (edgeArr) => {
  const x = 0;
  const y = 0;
  const edges = []
  edgeArr.map(edge => {
    console.log(edge);
    switch (edge) {
      case 0: 
       edges.push([x, y+1]);
       break;
      case 1: 
       edges.push([x+1, y]);
       break;
      case 2: 
       edges.push([x, y-1]);  
       break;
      case 3: 
       edges.push([x-1, y]);   
       break; 
    }
  })
  return edges;
}

export default tileLogic;