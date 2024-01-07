// redux
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
// reducers and sagas
import count, { countSaga } from "../pages/landing/model";

// combine reducers
const combinedReducer = combineReducers({
  count,
  // *** more reducers here ***
});

// saga middleware
const sagaMiddleware = createSagaMiddleware();

// store creation
const store = createStore(
  combinedReducer, // reducer
  applyMiddleware(logger, sagaMiddleware) // middleware
);

sagaMiddleware.run(countSaga);

export default store;
