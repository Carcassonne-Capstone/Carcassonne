import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

//initial state
const initialState = {
    deck: [],
    curTile: {},
    board: {}
}

//action types
const GOT_NEW_TILE = 'GOT_NEW_TILE'
const ADD_TO_BOARD = 'ADD_TO_BOARD'

//action creators
export const getNewTile = (tile) => ({type: GOT_NEW_TILE, tile})
export const addToBoard = (key, value) => ({type: ADD_TO_BOARD, key, value})

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