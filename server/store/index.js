import store from '../../client/store';

const {createStore, applyMiddleware} = require('redux')
const thunkMiddleware =  require('redux-thunk')
const axios = require('axios')
const initDeck = require('../GameObjects/startTiles')

//initial state
const initialState = {
    deck: []
}

//action types
const INITIALIZE_DECK = 'INITIALIZE_DECK'

//action creators
export const initializeDeck = (deck) => ({type: INITIALIZE_DECK, deck})

// thunk creators
export const initializeGame = () => {
    return (dispatch) => {
        let deck = initDeck;
        dispatch(initializeDeck(deck))
    }
}

//reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case INITIALIZE_DECK:
            return {...state, deck: action.deck}
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