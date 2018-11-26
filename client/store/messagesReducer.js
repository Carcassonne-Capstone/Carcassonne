const initialState = {
    joinRoomErr: '',
    startGameErr: '',
    messages: []
}

//action types
const SET_JOIN_ROOM_ERR = 'SET_JOIN_ROOM_ERR';
const SET_START_GAME_ERR = 'SET_START_GAME_ERR'
const POST_MESSAGE = 'POST_MESSAGE';

//action creators
export const setJoinRoomErr = (message) => ({type: SET_JOIN_ROOM_ERR, message});
export const setStartGameErr = (message) => ({type: SET_START_GAME_ERR, message})
export const postMessage = (player, message) => ({type: POST_MESSAGE, player, message})

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_JOIN_ROOM_ERR:
            return {...state, joinRoomErr: action.message}
        case SET_START_GAME_ERR:
            return {...state, startGameErr: action.message}
        case POST_MESSAGE:
            return {
              ...state, messages: [...state.messages, [action.player, action.message]]
            }  
        default:
            return state
    }
}

export default reducer
