// imports
import React, { useState, useMemo } from 'react';

const Fib = () => {
  const [n, setN] = useState(1);
  const [memo, setMemo] = useState({});
  // const [result, setResult] = useState(1);

  // memoized fibonacci function
  // doesn't store 'memo' in state
  const fib = (n, memo) => {
    // initialize memo or use argument as memo
    memo = memo || {};
    // use cached result
    if (memo[n]) return memo[n];
    // first result
    if (n <= 1) return 1;
    // calculate result
    console.log('calculating...');
    return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo)); // calculate result
  };

  // memoized fibonacci function
  // stores 'memo' in state
  const fib2 = (n, memo) => {
    // initialize memo or use argument as memo
    memo = memo || {};
    // use cached result
    if (memo[n]) return memo[n];
    // first result
    if (n <= 1) return 1;
    // calculate and store result
    console.log('calculating...');
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo); // calculate result
    if (typeof memo[n] === 'number' && memo[n] !== NaN) {
      setMemo(memo); // only set memo if recursion is done
    }
    return memo[n];
  };

  // useMemo (only run expensive calculation when dependency changes)
  const fibResult = useMemo(() => fib2(n, memo), [n]);

  // events
  const increment = () => setN(n + 1);
  const decrement = () => setN(n - 1);

  return (
    <div>
      <p>
        fib({n}) = {fibResult}
      </p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};

export default Fib;
