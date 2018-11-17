import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

//initial state
const initialState = {
    curTile: {},
    board: {},
    roomId: '',
    players: [],
    currentPlayer: '',
    unfilledTiles: {},
    gameState: ''
}

//action types
const GOT_NEW_TILE = 'GOT_NEW_TILE'
const ADD_TO_BOARD = 'ADD_TO_BOARD'
const CREATE_ROOM = 'CREATE_ROOM'
const JOIN_ROOM = 'JOIN_ROOM'
const INIT_GAME = 'INIT_GAME'

//action creators
export const getNewTile = (tile) => ({type: GOT_NEW_TILE, tile})
export const addToBoard = (key, value) => ({type: ADD_TO_BOARD, key, value})
export const createRoom = (roomId, player) => ({type: CREATE_ROOM, roomId, player})
export const joinRoom = (player) => ({type: JOIN_ROOM, player})
export const initGame = (players, roomId, startTile, curTile, currentPlayer) => ({type: INIT_GAME, players, roomId, startTile, curTile, currentPlayer})

// thunk creators
// export const getCard = (idx) => {
//     return async (dispatch) => {
//         try {
//             const res = await axios.get(`/api/card/${idx}`)
//             dispatch(gotCard(res.data))
//         } catch (err) {console.error(err)}
//     }
// }

//reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GOT_NEW_TILE:
            return {...state, curTile: action.tile}
        case ADD_TO_BOARD:
            return {...state, board: {...state.board, [action.key]: action.value}}
        case CREATE_ROOM:
            return {...state, roomId: action.roomId, players: [action.player]}
        case JOIN_ROOM:
            return {...state, players: [...state.players, action.player]}
        case INIT_GAME:
            return {
                ...state,
                players: action.players,
                roomId: action.roomId,
                curTile: action.curTile,
                currentPlayer: action.currentPlayer,
                board: {[[0,0]]: action.startTile},
                gameState: 'playing'
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