// imports
import React, { useState, useCallback } from 'react'

// useCallback -- return memoized function that only changes if deps change
  // when count1 changes, only update the functions that list it as a dep
  // same with count2

// component
const Counter = () => {

  // counters
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  // events
  const increment1 = useCallback(() => {
    setCount1(count1 + 1);
  }, [count1])
  const decrement1 = useCallback(() => {
    setCount1(count1 - 1);
  }, [count1])
  const increment2 = useCallback(() => {
    setCount2(count2 + 1);
  }, [count2])
  const decrement2 = useCallback(() => {
    setCount2(count2 - 1);
  }, [count2])

  // jsx
  return (
    <>
      Count1: {count1}
      <button onClick={increment1}>+</button>
      <button onClick={decrement1}>-</button>

      <br/>

      Count2: {count2}
      <button onClick={increment2}>+</button>
      <button onClick={decrement2}>-</button>
    </>
  );
}

export default Counter;
