// imports
import React from 'react';
import { connect } from 'react-redux';
import { increment, decrement, reset } from '../../redux/actions';

// component
const Landing = (props) => {
  console.log(props.count);
  // jsx
  return (
    <div>
      <p>Count</p>
      <p>{props.count.value}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

// map state to props
const mapStateToProps = (state) => {
  return {
    count: state.count,
  };
};

// map dispatch to props
const mapDispatchToProps = { increment, decrement, reset };

// connect component to state
// connect is a HOC that returns a state-connected-component
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
