import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios'
import messages from './messagesReducer'
import game from './gameReducer'

export default createStore(
  combineReducers({game, messages}),
  applyMiddleware(thunkMiddleware.withExtraArgument({ axios }))
);

export * from './gameReducer'
export * from './messagesReducer'