// imports
import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from 'redux-logger'
import count from "./reducers/count";

// combine reducers
const combinedReducer = combineReducers({
  count
  // *** more reducers here ***
});

// middleware (logger)
const middleware = [logger];

// store creation (from combined reducers)
const store = createStore(
  combinedReducer, // reducer
  applyMiddleware(...middleware) // middleware
);

export default store;