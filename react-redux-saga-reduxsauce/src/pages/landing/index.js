// react
import React from "react";
// redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// model
import { Creators as CountActionCreators } from "./model";
// assets
import "./style.scss";

// component
const Landing = ({ count, increment, decrement, reset }) => {
  // jsx
  return (
    <div>
      <p>Count</p>
      <p>{count.value}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

// ---
// redux
// ---

// map state to props

const mapStateToProps = (state) => ({
  count: state.count,
});

// map dispatch to props

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...CountActionCreators }, dispatch);

// "connect" is a HOC that returns a state-connected-component
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
