import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

//initial state
const initialState = {
    speed: 0.02
}

//action types
const GOT_NEW_SPEED = 'GOT_NEW_SPEED'

//action creators
export const gotNewSpeed = (speed) => ({type: GOT_NEW_SPEED, speed})

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
        case GOT_NEW_SPEED:
            return {...state, allPlayers: action.speed}
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