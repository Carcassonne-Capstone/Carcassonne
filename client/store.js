import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'
import TileNode from './components/BoardComponents/TileNode'
import socket from './socket'

const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

//initial state
const initialState = {
    curTile: {},
    board: {},
    roomId: '',
    players: [],
    currentPlayer: '',
    unfilledTiles: {},
    gameState: '',
    startTile: {}
}

//action types
const GOT_NEW_TILE = 'GOT_NEW_TILE'
const CREATE_ROOM = 'CREATE_ROOM'
const JOIN_ROOM = 'JOIN_ROOM'
const INIT_GAME = 'INIT_GAME'
const UPDATE_BOARD = 'UPDATE_BOARD'
const ROTATE_TILE = 'ROTATE_TILE'

//action creators
export const getNewTile = (tile, x, y) => ({type: GOT_NEW_TILE, tile, x, y})
export const createRoom = (roomId, player) => ({type: CREATE_ROOM, roomId, player})
export const joinRoom = (player) => ({type: JOIN_ROOM, player})
export const initGame = (players, roomId, startTile, curTile, currentPlayer) => ({type: INIT_GAME, players, roomId, startTile, curTile, currentPlayer})
export const updateBoard = (x, y) => ({type: UPDATE_BOARD, x, y})
export const rotate = () => ({type: ROTATE_TILE})
// thunk creators
// export const tilePlaced = (x, y) => {
//     return (dispatch) => {
//         try {
//             const res = await axios.get(`/api/card/${idx}`)
//             dispatch(gotCard(res.data))
//         } catch (err) {console.error(err)}
//     }
// }

const updateNeighbors = (xVal, yVal, tileNode, board) => {
    const possibleDirs = [`${xVal},${yVal+1}`,`${xVal+1},${yVal}`,`${xVal},${yVal-1}`,`${xVal-1},${yVal}`];
    for (let i = 0; i < possibleDirs.length; i++) {
        if (board.hasOwnProperty(possibleDirs[i])) {
            tileNode.setNeighbor(i, board[possibleDirs[i]]);
        }
    }
}

const createNewUnfilled = (curUnfilled, x, y, board) => {
    const newUnfilledObj = {...curUnfilled}
    delete newUnfilledObj[`${x},${y}`]
    const dirs = [`${x},${y+1}`,`${x+1},${y}`,`${x},${y-1}`,`${x-1},${y}`];
    for (let i = 0; i < dirs.length; i++) {
        if (!board.hasOwnProperty(dirs[i])) {
            const newTileNode = new TileNode(null)
            let xVal = parseInt(dirs[i].split(',')[0], 10)
            let yVal = parseInt(dirs[i].split(',')[1], 10)
            updateNeighbors(xVal, yVal, newTileNode, board)
            newUnfilledObj[dirs[i]] = newTileNode
        }
    }
    return newUnfilledObj
}

//reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GOT_NEW_TILE:
            return {...state, curTile: new TileNode(action.tile), unfilledTiles: createNewUnfilled(state.unfilledTiles, action.x, action.y, state.board)}
        case CREATE_ROOM:
            return {...state, roomId: action.roomId, players: [action.player]}
        case JOIN_ROOM:
            return {...state, players: [...state.players, action.player]}
        case UPDATE_BOARD:
            const board = {...state.board}
            updateNeighbors(action.x, action.y, state.curTile, board)
            board[`${action.x},${action.y}`] = state.curTile
            socket.emit('tilePlaced', state.roomId, action.x, action.y)
            return {...state, board: board}
        case INIT_GAME:
            const startNode = new TileNode(action.startTile)
            const curTileNode = new TileNode(action.curTile)
            console.log("current tile node", curTileNode);
            const neighb0 = new TileNode(null)
            neighb0.setNeighbor(bottom, startNode)
            const neighb1 = new TileNode(null)
            neighb1.setNeighbor(left, startNode)
            const neighb2 = new TileNode(null)
            neighb2.setNeighbor(top, startNode)
            const neighb3 = new TileNode(null)
            neighb3.setNeighbor(right, startNode)
            return {
                ...state,
                players: action.players,
                roomId: action.roomId,
                curTile: curTileNode,
                startTile: startNode,
                currentPlayer: action.currentPlayer,
                board: {[[0,0]]: startNode},
                gameState: 'playing',
                unfilledTiles: {
                    [[0,1]]: neighb0,
                    [[1,0]]: neighb1,
                    [[0,-1]]: neighb2,
                    [[-1,0]]: neighb3
                }
            }
        case ROTATE_TILE:
            const newTile = Object.assign(Object.create(Object.getPrototypeOf(state.curTile)), state.curTile);
            newTile.rotate();
            console.log("rotated tile in reducer", newTile);
            return {...state, curTile: newTile};
        default:
            return state;
    }
}

export default createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware.withExtraArgument({axios})
    )
)