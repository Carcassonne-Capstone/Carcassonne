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
const ADD_TO_BOARD = 'ADD_TO_BOARD'
const CREATE_ROOM = 'CREATE_ROOM'
const JOIN_ROOM = 'JOIN_ROOM'
const INIT_GAME = 'INIT_GAME'
const UPDATE_UNFILLED = 'UPDATE_UNFILLED'

//action creators
export const getNewTile = (tile) => ({type: GOT_NEW_TILE, tile})
export const addToBoard = (key, value) => ({type: ADD_TO_BOARD, key, value})
export const createRoom = (roomId, player) => ({type: CREATE_ROOM, roomId, player})
export const joinRoom = (player) => ({type: JOIN_ROOM, player})
export const initGame = (players, roomId, startTile, curTile, currentPlayer) => ({type: INIT_GAME, players, roomId, startTile, curTile, currentPlayer})
export const updateUnfilled = (x, y) => ({type: UPDATE_UNFILLED, x, y})
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

//reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GOT_NEW_TILE:
            const newTile = new TileNode(action.tile)
            return {...state, curTile: newTile}
        case ADD_TO_BOARD:
            return {...state, board: {...state.board, [action.key]: action.value}}
        case CREATE_ROOM:
            return {...state, roomId: action.roomId, players: [action.player]}
        case JOIN_ROOM:
            return {...state, players: [...state.players, action.player]}
        case UPDATE_UNFILLED:
            const newUnfilledObj = {...state.unfilledTiles}
            const board = {...state.board}
            updateNeighbors(action.x, action.y, state.curTile, board)
            board[`${action.x},${action.y}`] = state.curTile
            delete newUnfilledObj[`${action.x},${action.y}`]
            const dirs = [`${action.x},${action.y+1}`,`${action.x+1},${action.y}`,`${action.x},${action.y-1}`,`${action.x-1},${action.y}`];
            for (let i = 0; i < dirs.length; i++) {
                if (!board.hasOwnProperty(dirs[i])) {
                    const newTileNode = new TileNode(null)
                    let xVal = parseInt(dirs[i].split(',')[0], 10)
                    let yVal = parseInt(dirs[i].split(',')[1], 10)
                    updateNeighbors(xVal, yVal, newTileNode, board)
                    newUnfilledObj[dirs[i]] = newTileNode
                }
            }
            socket.emit('tilePlaced', state.roomId)
            return {...state, unfilledTiles: newUnfilledObj, board: board}
        case INIT_GAME:
            const startNode = new TileNode(action.startTile)
            const curTileNode = new TileNode(action.curTile)
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