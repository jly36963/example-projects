
// imports
import store from "./store";

// actions
const incrementCount = (payload = 1) => ({
  type: "INCREMENT",
  payload
});
const decrementCount = (payload = 1) => ({
  type: "DECREMENT",
  payload
});
const resetCount = () => ({
  type: "RESET"
});

// action generators
export const increment = () => {
  store.dispatch(incrementCount());
};
export const decrement = () => {
  store.dispatch(decrementCount());
};
export const reset = () => {
  store.dispatch(resetCount());
};