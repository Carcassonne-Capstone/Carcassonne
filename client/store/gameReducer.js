import TileNode from "../components/BoardComponents/TileNode";
import { findRegion } from "../components/renderFuncs/checkValid";

const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

//initial state--
const initialState = {
  player: {},
  curTile: {},
  curLocation: null,
  board: {},
  roomId: "",
  players: [],
  currentPlayer: "",
  unfilledTiles: {},
  gameState: "",
  startTile: {},
  curMeeple: {},
  scores: {},
  meeplesOnBoard: [],
  removeMeeples: [],
  monasteryTiles: [],
  meepleSelection: ["monkey", "lion", "tiger", "gorilla", "elephant"]
};

//action types
const CREATE_ROOM = "CREATE_ROOM";
const JOIN_ROOM = "JOIN_ROOM";
const INIT_GAME = "INIT_GAME";
const ROTATE_TILE = "ROTATE_TILE";
const NEXT_TURN = "NEXT_TURN";
const ADD_TO_BOARD = "ADD_TO_BOARD";
const SET_PLAYER = "SET_PLAYER";
const SET_MEEPLE = "SET_MEEPLE";
const GAME_OVER = "GAME_OVER";
const SELECT_MEEPLE = "SELECT_MEEPLE";
const NEW_HOST = "NEW_HOST";

//action creators
export const createRoom = (roomId, player) => ({
  type: CREATE_ROOM,
  roomId,
  player
});
export const joinRoom = player => ({ type: JOIN_ROOM, player });
export const initGame = (
  players,
  roomId,
  startTile,
  curTile,
  currentPlayer
) => ({ type: INIT_GAME, players, roomId, startTile, curTile, currentPlayer });
export const rotate = () => ({ type: ROTATE_TILE });
export const nextTurn = (player, tile) => ({ type: NEXT_TURN, player, tile });
export const addToBoard = coords => ({ type: ADD_TO_BOARD, coords });
export const setPlayer = (player, meeple) => ({
  type: SET_PLAYER,
  player,
  meeple
});
export const setMeeple = meeple => ({ type: SET_MEEPLE, meeple });
export const gameOver = () => ({ type: GAME_OVER });
export const selectMeeple = (meeple, newMeeple, player) => ({
  type: SELECT_MEEPLE,
  meeple,
  newMeeple,
  player
});
export const newHost = players => ({ type: NEW_HOST, players });

const getNeighbors = (x, y) => {
  return [`${x},${y + 1}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x - 1},${y}`];
};

const initStartNode = startTile => {
  const startNode = new TileNode(startTile);
  startNode.setCoords([0, 0]);
  const neighb0 = new TileNode(null);
  neighb0.setNeighbor(bottom, startNode);
  const neighb1 = new TileNode(null);
  neighb1.setNeighbor(left, startNode);
  const neighb2 = new TileNode(null);
  neighb2.setNeighbor(top, startNode);
  const neighb3 = new TileNode(null);
  neighb3.setNeighbor(right, startNode);
  const unfilled = {
    [[0, 1]]: neighb0,
    [[1, 0]]: neighb1,
    [[0, -1]]: neighb2,
    [[-1, 0]]: neighb3
  };
  return { startNode, unfilled };
};

const initScores = players => {
  const scores = {};
  players.forEach(player => {
    scores[player.name] = 0;
  });
  return scores;
};

const rotateTileCopy = tile => {
  const newTile = Object.assign(
    Object.create(Object.getPrototypeOf(tile)),
    tile
  );
  newTile.rotate();
  return newTile;
};

const updateNeighbors = (xVal, yVal, tileNode, board, update) => {
  tileNode.resetNeighbors();
  const possibleDirs = getNeighbors(xVal, yVal);
  for (let i = 0; i < possibleDirs.length; i++) {
    if (board.hasOwnProperty(possibleDirs[i])) {
      tileNode.setNeighbor(i, board[possibleDirs[i]]);
      if (update) {
        board[possibleDirs[i]].setNeighbor(tileNode.findOppEdge(i), tileNode);
      }
    }
  }
};

const createNewUnfilled = (curUnfilled, x, y, board) => {
  const newUnfilledObj = { ...curUnfilled };
  delete newUnfilledObj[`${x},${y}`];
  const dirs = getNeighbors(x, y);
  for (let i = 0; i < dirs.length; i++) {
    if (!board.hasOwnProperty(dirs[i])) {
      const newTileNode = new TileNode(null);
      updateNeighbors(
        parseInt(dirs[i].split(",")[0], 10),
        parseInt(dirs[i].split(",")[1], 10),
        newTileNode,
        board
      );
      newUnfilledObj[dirs[i]] = newTileNode;
    }
  }
  return newUnfilledObj;
};

const updatePlayerMeepleCnt = (
  curPlayer,
  allPlayers,
  addVal,
  returnOriginal
) => {
  if (returnOriginal) return allPlayers;
  let allPlayersCopy = [...allPlayers];
  const idx = allPlayersCopy.findIndex(
    player => player.name === curPlayer.name
  );
  allPlayersCopy[idx].meeple += addVal;
  return allPlayersCopy;
};

const addInitNeighbors = (tileNode, region, blocksToCheck) => {
  let regionClosed = true;
  for (let i = 0; i < region.edges.length; i++) {
    let neighbor = tileNode.neighbors[region.edges[i]];
    if (neighbor) {
      let oppEdge = tileNode.findOppEdge(region.edges[i]);
      blocksToCheck.push({ tileNode: neighbor, edge: oppEdge });
    } else {
      regionClosed = false;
    }
  }
  return regionClosed;
};

const addNewNeighbors = (region, block, blocksToCheck) => {
  let regionClosed = true;
  region.edges.forEach(edge => {
    if (edge !== block.edge) {
      const neighbor = block.tileNode.neighbors[edge];
      if (neighbor) {
        const oppEdge = block.tileNode.findOppEdge(edge);
        blocksToCheck.push({ tileNode: neighbor, edge: oppEdge });
      } else {
        regionClosed = false;
      }
    }
  });
  return regionClosed;
};

const addToScores = (
  scores,
  players,
  addPoints,
  maxMeeples,
  extraPoints,
  multiplyVal = 1
) => {
  for (let key in players) {
    if (players.hasOwnProperty(key) && players[key] === maxMeeples) {
      scores[key] += addPoints * multiplyVal + extraPoints;
    }
  }
};

const updateMeeplePlayers = (meeplePlayers, region, maxMeeples) => {
  if (meeplePlayers.hasOwnProperty(region.meeple[0].player.name)) {
    meeplePlayers[region.meeple[0].player.name]++;
  } else {
    meeplePlayers[region.meeple[0].player.name] = 1;
  }
  return Math.max(maxMeeples, meeplePlayers[region.meeple[0].player.name]);
};

const updateMonasteryScores = (
  monasteryTiles,
  board,
  updateNotClosed,
  curScores,
  meeplesToRemove
) => {
  let newMonasteries = [];
  monasteryTiles.forEach(monastery => {
    let totalPoints = 1,
      isClosing = true;
    const x = monastery.coords[0],
      y = monastery.coords[1];
    let corners = [
      `${x + 1},${y + 1}`,
      `${x + 1},${y - 1}`,
      `${x - 1},${y - 1}`,
      `${x - 1},${y + 1}`
    ];
    corners.forEach((corner, i) => {
      if (monastery.neighbors[i]) totalPoints++;
      if (board.hasOwnProperty(corner)) totalPoints++;
      if (!monastery.neighbors[i] || !board.hasOwnProperty(corner))
        isClosing = false;
    });
    if (updateNotClosed || isClosing) {
      let monasteryRegion = monastery.tile.regions.find(
        region => region.type === "monastery"
      );
      meeplesToRemove.push(monasteryRegion.meeple[0]);
      curScores[monasteryRegion.meeple[0].player.name] += totalPoints;
    } else {
      newMonasteries.push(monastery);
    }
  });
  return newMonasteries;
};

const updateScores = (tileNodePlaced, curScores) => {
  let meeplesToRemove = [];
  // eslint-disable-next-line complexity
  tileNodePlaced.tile.regions.forEach(region => {
    if (region.type !== "monastery" && region.type !== "field") {
      let maxMeeples = 0,
        meeplePlayers = {},
        numTilesInRegion = 1,
        meeples = [];
      const visitedTiles = new Set(),
        blocksToCheck = [];
      visitedTiles.add("" + tileNodePlaced.coords + "" + region.meeplePosition);
      if (region.meeple.length) {
        meeplePlayers[region.meeple[0].player.name] = 1;
        meeples.push(region.meeple[0]);
        maxMeeples = 1;
      }
      let extraPoints = region.hasShield ? 2 : 0;
      let regionClosed = addInitNeighbors(
        tileNodePlaced,
        region,
        blocksToCheck
      );
      while (blocksToCheck.length && regionClosed) {
        const block = blocksToCheck.shift();
        const curRegion = findRegion(block.tileNode.tile, block.edge);
        if (
          !visitedTiles.has(
            "" + block.tileNode.coords + "" + curRegion.meeplePosition
          )
        ) {
          numTilesInRegion++;
          visitedTiles.add(
            "" + block.tileNode.coords + "" + curRegion.meeplePosition
          );
          if (curRegion.hasShield) extraPoints += 2;
          if (curRegion.meeple.length) {
            maxMeeples = updateMeeplePlayers(
              meeplePlayers,
              curRegion,
              maxMeeples
            );
            meeples.push(curRegion.meeple[0]);
          }
          regionClosed = addNewNeighbors(curRegion, block, blocksToCheck);
        }
      }
      if (regionClosed) {
        const scoreVal = region.type === "city" ? 2 : 1;
        addToScores(
          curScores,
          meeplePlayers,
          numTilesInRegion,
          maxMeeples,
          extraPoints,
          scoreVal
        );
        meeplesToRemove = [...meeplesToRemove, ...meeples];
      }
    }
  });
  return { meeplesToRemove, curScores };
};

export const finalScores = (meeplesOnBoard, curScores, monasteries, board) => {
  updateMonasteryScores(monasteries, board, true, curScores, []);
  const meeplesChecked = new Set();
  // eslint-disable-next-line complexity
  meeplesOnBoard.forEach(meepleObj => {
    if (
      !meeplesChecked.has(
        meepleObj.meeple.tile.object.name + meepleObj.meeple.regionIdx
      )
    ) {
      let tileNode = meepleObj.tile;
      let region = tileNode.tile.regions[meepleObj.meeple.regionIdx];
      if (region.type !== "monastery") {
        let curPlayers = { [meepleObj.meeple.player.name]: 1 };
        let addPoints = 1;
        let maxMeeples = 1;
        const visitedTiles = new Set();
        visitedTiles.add("" + tileNode.coords + "" + region.meeplePosition);
        const blocksToCheck = [];
        let extraPoints = region.hasShield ? 2 : 0;
        addInitNeighbors(tileNode, region, blocksToCheck);
        while (blocksToCheck.length) {
          addPoints++;
          const block = blocksToCheck.shift();
          const curRegion = findRegion(block.tileNode.tile, block.edge);
          if (
            !visitedTiles.has(
              "" + block.tileNode.coords + "" + region.curRegion
            )
          ) {
            visitedTiles.add(
              "" + block.tileNode.coords + "" + region.curRegion
            );
            if (curRegion.hasShield) extraPoints += 2;
            if (curRegion.meeple && curRegion.meeple.length) {
              meeplesChecked.add(
                curRegion.meeple[0].tile.object.name +
                  curRegion.meeple[0].regionIdx
              );
              maxMeeples = updateMeeplePlayers(
                curPlayers,
                curRegion,
                maxMeeples
              );
            }
            addNewNeighbors(curRegion, block, blocksToCheck, visitedTiles);
          }
        }
        addToScores(curScores, curPlayers, addPoints, maxMeeples, extraPoints);
      }
    }
  });
  console.log("FINAL SCORES", curScores);
  return curScores;
};

const updateMonasteries = (monasteries, tileNode) => {
  tileNode.tile.regions.forEach(region => {
    if (region.type === "monastery" && region.meeple.length) {
      monasteries.push(tileNode);
    }
  });
  return monasteries;
};

const nextTurnUpdates = (
  board,
  curLocation,
  curTile,
  curMeeple,
  scores,
  newPlayersState,
  meeplesOnBoard,
  monasteryTiles
) => {
  updateNeighbors(curLocation[0], curLocation[1], curTile, board, true);
  const tilePlaced = Object.assign(
    Object.create(Object.getPrototypeOf(curTile)),
    curTile
  );
  if (curMeeple.coords) {
    tilePlaced.tile.regions[curMeeple.regionIdx].meeple.push(curMeeple);
    meeplesOnBoard.push({ tile: tilePlaced, meeple: curMeeple });
  }
  board[`${curLocation[0]},${curLocation[1]}`] = tilePlaced;
  let newMonasteries = updateMonasteries(monasteryTiles, tilePlaced);
  const { meeplesToRemove, curScores } = updateScores(tilePlaced, {
    ...scores
  });
  newMonasteries = updateMonasteryScores(
    newMonasteries,
    board,
    false,
    curScores,
    meeplesToRemove
  );
  meeplesToRemove.forEach(meeple => {
    let idx = newPlayersState.findIndex(
      player => player.name === meeple.player.name
    );
    meeplesOnBoard = meeplesOnBoard.filter(meepleObj => {
      return (
        meepleObj.meeple.tile.object.name !== meeple.tile.object.name ||
        meepleObj.meeple.regionIdx !== meeple.regionIdx
      );
    });
    newPlayersState[idx].meeple++;
  });
  return {
    board,
    meeplesToRemove,
    curScores,
    newPlayersState,
    meeplesOnBoard,
    newMonasteries
  };
};

//reducer
// eslint-disable-next-line complexity
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYER:
      return {
        ...state,
        player: action.player,
        meepleSelection: action.meeple
      };
    case CREATE_ROOM:
      return {
        ...state,
        roomId: action.roomId,
        players: [action.player],
        player: action.player
      };
    case JOIN_ROOM:
      return { ...state, players: [...state.players, action.player] };
    case ROTATE_TILE:
      return { ...state, curTile: rotateTileCopy(state.curTile) };
    case SET_MEEPLE:
      return {
        ...state,
        curMeeple: action.meeple,
        players: updatePlayerMeepleCnt(
          state.currentPlayer,
          state.players,
          -1,
          state.curMeeple.coords
        )
      };
    case GAME_OVER:
      const returnObjects = nextTurnUpdates(
        { ...state.board },
        state.curLocation,
        state.curTile,
        state.curMeeple,
        { ...state.scores },
        [...state.players],
        [...state.meeplesOnBoard],
        [...state.monasteryTiles]
      );
      return {
        ...state,
        gameState: "gameOver",
        scores: finalScores(
          returnObjects.meeplesOnBoard,
          returnObjects.curScores,
          returnObjects.newMonasteries,
          returnObjects.board
        )
      };
    case ADD_TO_BOARD:
      state.curTile.setCoords(action.coords);
      if (action.coords)
        updateNeighbors(
          action.coords[0],
          action.coords[1],
          state.curTile,
          state.board,
          false
        );
      return {
        ...state,
        curLocation: action.coords,
        curMeeple: {},
        players: updatePlayerMeepleCnt(
          state.currentPlayer,
          state.players,
          1,
          !state.curMeeple.coords
        )
      };
    case NEXT_TURN:
      const {
        board,
        meeplesToRemove,
        curScores,
        newPlayersState,
        meeplesOnBoard,
        newMonasteries
      } = nextTurnUpdates(
        { ...state.board },
        state.curLocation,
        state.curTile,
        state.curMeeple,
        { ...state.scores },
        [...state.players],
        [...state.meeplesOnBoard],
        [...state.monasteryTiles]
      );
      return {
        ...state,
        currentPlayer: action.player,
        curTile: new TileNode(action.tile),
        unfilledTiles: createNewUnfilled(
          state.unfilledTiles,
          state.curLocation[0],
          state.curLocation[1],
          board
        ),
        board: board,
        curLocation: null,
        curMeeple: {},
        removeMeeples: meeplesToRemove,
        scores: curScores,
        allPlayers: newPlayersState,
        meeplesOnBoard: meeplesOnBoard,
        monasteryTiles: newMonasteries
      };
    case INIT_GAME:
      const { startNode, unfilled } = initStartNode(action.startTile);
      return {
        ...state,
        players: action.players,
        roomId: action.roomId,
        curTile: new TileNode(action.curTile),
        startTile: startNode,
        currentPlayer: action.currentPlayer,
        board: { [[0, 0]]: startNode },
        gameState: "playing",
        unfilledTiles: unfilled,
        scores: initScores(action.players)
      };
    case SELECT_MEEPLE:
      if (state.player.name === action.player.name) {
        return {
          ...state,
          player: { ...state.player, animal: action.meeple },
          meepleSelection: action.newMeeple
        };
      } else {
        return {
          ...state,
          meepleSelection: action.newMeeple
        };
      }
    case NEW_HOST:
      return {
        ...state,
        player: action.players.find(
          curPlayer => curPlayer.name === state.player.name
        )
      };
    default:
      return state;
  }
};

export default reducer;
