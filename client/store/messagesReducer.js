const initialState = {
    joinRoomErr: '',
    startGameErr: '',
    messages: [],
    disconnectedPlayers: [],
    playingWithBots: false,
    hostLeft: false
}

//action types
const SET_JOIN_ROOM_ERR = 'SET_JOIN_ROOM_ERR';
const SET_START_GAME_ERR = 'SET_START_GAME_ERR'
const POST_MESSAGE = 'POST_MESSAGE';
const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED'
const PLAY_WITH_BOTS = 'PLAY_WITH_BOTS'
const HOST_LEFT = 'HOST_LEFT'

//action creators
export const setJoinRoomErr = (message) => ({type: SET_JOIN_ROOM_ERR, message});
export const setStartGameErr = (message) => ({type: SET_START_GAME_ERR, message})
export const postMessage = (player, message) => ({type: POST_MESSAGE, player, message})
export const playerDisconnected = (player) => ({type: PLAYER_DISCONNECTED, player})
export const playingWithBots = () => ({type: PLAY_WITH_BOTS})
export const hostLeft = (didLeave) => ({type: HOST_LEFT, didLeave})

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_JOIN_ROOM_ERR:
            return {...state, joinRoomErr: action.message}
        case SET_START_GAME_ERR:
            return {...state, startGameErr: action.message}
        case POST_MESSAGE:
            const messageNot = new Audio('/definite.mp3')
            messageNot.play();
            return {...state, messages: [...state.messages, [action.player, action.message]]} 
        case PLAYER_DISCONNECTED:
            return {...state, disconnectedPlayers: [...state.disconnectedPlayers, action.player]}
        case PLAY_WITH_BOTS:
            return {...state, playingWithBots: true}
        case HOST_LEFT:
            return {...state, hostLeft: action.didLeave}
        default:
            return state
    }
}

export default reducer
