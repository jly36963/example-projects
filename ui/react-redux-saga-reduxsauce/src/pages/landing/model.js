import { createActions, createReducer } from "reduxsauce";
import { takeEvery, select } from "redux-saga/effects";

// initial state

const initialState = {
  value: 0,
};

// generate types and action creators

export const { Types, Creators } = createActions(
  {
    increment: { payload: 1 }, // params with defaults
    decrement: { payload: 1 }, // params with defaults
    reset: [], // no params
  },
  {}
);

// handler functions for reducer

const handleIncrement = (state, action) => ({
  ...state,
  value: state.value + action.payload,
});
const handleDecrement = (state, action) => ({
  ...state,
  value: state.value - action.payload,
});
const handleReset = (state) => ({
  ...state,
  value: 0,
});

// map action types to handlers

export const handlers = {
  [Types.INCREMENT]: handleIncrement,
  [Types.DECREMENT]: handleDecrement,
  [Types.RESET]: handleReset,
};

// create reducer

export default createReducer(initialState, handlers);

// selector

const getCount = (state) => state.count;

// create saga (handle side effects)

function* logValue() {
  const count = yield select(getCount);
  console.log(`count: ${count.value}`);

  /* 
  // select
  const count = yield select(getCount); // access state in saga
  // delay
  yield delay(1000); // block execution
  // put
  yield put({ type: INCREMENT}) // schedule another action
  */
}

export function* countSaga() {
  yield takeEvery([Types.INCREMENT, Types.DECREMENT, Types.RESET], logValue);

  /* 
  // takeEvery -- allow multiple actions of the same type to be scheduled.
  // takeLatest -- cancel any other (earlier) scheduled actions of same type
  yield takeLatest([Types.INCREMENT, Types.DECREMENT], logValue);
  */
}
