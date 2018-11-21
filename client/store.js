import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import axios from "axios";
import TileNode from "./components/BoardComponents/TileNode";
import socket from "./socket";

const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

//initial state
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
  curMeeple: {}
};

//action types
const CREATE_ROOM = "CREATE_ROOM";
const JOIN_ROOM = "JOIN_ROOM";
const INIT_GAME = "INIT_GAME";
const UPDATE_BOARD = "UPDATE_BOARD";
const ROTATE_TILE = "ROTATE_TILE";
const NEXT_TURN = "NEXT_TURN";
const ADD_TO_BOARD = "ADD_TO_BOARD";
const SET_PLAYER = "SET_PLAYER";
const SET_MEEPLE = "SET_MEEPLE";

//action creators
// export const getNewTile = (tile, x, y) => ({type: GOT_NEW_TILE, tile, x, y})
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
export const updateBoard = (x, y) => ({ type: UPDATE_BOARD, x, y });
export const rotate = () => ({ type: ROTATE_TILE });
export const nextTurn = (player, tile) => ({ type: NEXT_TURN, player, tile });
export const addToBoard = coords => ({ type: ADD_TO_BOARD, coords });
export const setPlayer = player => ({ type: SET_PLAYER, player });
export const setMeeple = meeple => ({ type: SET_MEEPLE, meeple });
// thunk creators
// export const tilePlaced = (x, y) => {
//     return (dispatch) => {
//         try {
//             const res = await axios.get(`/api/card/${idx}`)
//             dispatch(gotCard(res.data))
//         } catch (err) {console.error(err)}
//     }
// }

const updateNeighbors = (xVal, yVal, tileNode, board, update) => {
  tileNode.resetNeighbors();
  const possibleDirs = [
    `${xVal},${yVal + 1}`,
    `${xVal + 1},${yVal}`,
    `${xVal},${yVal - 1}`,
    `${xVal - 1},${yVal}`
  ];
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
  const dirs = [
    `${x},${y + 1}`,
    `${x + 1},${y}`,
    `${x},${y - 1}`,
    `${x - 1},${y}`
  ];
  for (let i = 0; i < dirs.length; i++) {
    if (!board.hasOwnProperty(dirs[i])) {
      const newTileNode = new TileNode(null);
      let xVal = parseInt(dirs[i].split(",")[0], 10);
      let yVal = parseInt(dirs[i].split(",")[1], 10);
      updateNeighbors(xVal, yVal, newTileNode, board);
      newUnfilledObj[dirs[i]] = newTileNode;
    }
  }
  return newUnfilledObj;
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYER:
      return { ...state, player: action.player };
    case ADD_TO_BOARD:
      if (action.coords) {
        updateNeighbors(
          action.coords[0],
          action.coords[1],
          state.curTile,
          state.board,
          false
        );
      }
      return { ...state, curLocation: action.coords };
    case CREATE_ROOM:
      return {
        ...state,
        roomId: action.roomId,
        players: [action.player],
        player: action.player
      };
    case JOIN_ROOM:
      return { ...state, players: [...state.players, action.player] };
    case NEXT_TURN:
      const board = { ...state.board };
      updateNeighbors(
        state.curLocation[0],
        state.curLocation[1],
        state.curTile,
        board,
        true
      );
      const tilePlaced = Object.assign(
        Object.create(Object.getPrototypeOf(state.curTile)),
        state.curTile
      );
      console.log("cur meeple", state.curMeeple);
      if (state.curMeeple.coords) {
        console.log("PLACING MEEPLE");
        tilePlaced.tile.regions[state.curMeeple.regionIdx].meeple.push(
          state.curMeeple
        );
      }
      board[`${state.curLocation[0]},${state.curLocation[1]}`] = state.curTile;
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
        curMeeple: {}
      };
    // case UPDATE_BOARD:
    //     const board = {...state.board}
    //     updateNeighbors(action.x, action.y, state.curTile, board)
    //     board[`${action.x},${action.y}`] = state.curTile
    //     return {...state, board: board, curLocation: [action.x, action.y]}
    case INIT_GAME:
      const startNode = new TileNode(action.startTile);
      const curTileNode = new TileNode(action.curTile);
      const neighb0 = new TileNode(null);
      neighb0.setNeighbor(bottom, startNode);
      const neighb1 = new TileNode(null);
      neighb1.setNeighbor(left, startNode);
      const neighb2 = new TileNode(null);
      neighb2.setNeighbor(top, startNode);
      const neighb3 = new TileNode(null);
      neighb3.setNeighbor(right, startNode);
      return {
        ...state,
        players: action.players,
        roomId: action.roomId,
        curTile: curTileNode,
        startTile: startNode,
        currentPlayer: action.currentPlayer,
        board: { [[0, 0]]: startNode },
        gameState: "playing",
        unfilledTiles: {
          [[0, 1]]: neighb0,
          [[1, 0]]: neighb1,
          [[0, -1]]: neighb2,
          [[-1, 0]]: neighb3
        }
      };
    case ROTATE_TILE:
      const newTile = Object.assign(
        Object.create(Object.getPrototypeOf(state.curTile)),
        state.curTile
      );
      newTile.rotate();
      return { ...state, curTile: newTile };
    case SET_MEEPLE:
      return { ...state, curMeeple: action.meeple };
    default:
      return state;
  }
};

export default createStore(
  reducer,
  applyMiddleware(thunkMiddleware.withExtraArgument({ axios }))
);
