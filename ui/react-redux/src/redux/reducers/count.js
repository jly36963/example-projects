// imports
import { INCREMENT, DECREMENT, RESET } from '../actionTypes';

// inital state
const initialState = {
  value: 0,
};
// reducer
const count = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        value: state.value + action.payload,
      };
    case DECREMENT:
      return {
        ...state,
        value: state.value - action.payload,
      };
    case RESET:
      return {
        ...state,
        value: 0,
      };
    default:
      return state;
  }
};

export default count;
