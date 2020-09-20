// imports
import React, { useState, useReducer } from 'react'

// initial state
const initialState = { count: 0 };

// reducer
const countReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      // return { count: state.count };
      throw new Error();
  }
}
// component
const Counter = () => {
  // reducer hook
  const [state, dispatch] = useReducer(countReducer, initialState);
  // jsx
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>reset</button>
    </>
  );
}

export default Counter;


/*



// --------------
// example (useReducer) (lazy)
// --------------

// initialize count
const init = (initialCount) => {
  return { count: initialCount };
}
// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}
// component
const Counter = ({ initialCount }) => {
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // jsx
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({ type: 'reset', payload: initialCount })}>
        Reset
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}


*/