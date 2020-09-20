
import React, { useState, useEffect } from 'react';

const Counter = () => {
  // useState hook
  const [count, setCount] = useState(0);

  // useEffect 
    // make DOM updates here.
    // array argument
      // no array -- always run effect
      // empty array -- only run effect first time
      // array with elements -- run effect when an element changes
  useEffect(() => {
    console.log(`You clicked ${count} times`)
    document.title = count;
  }, [count]);

  // jsx
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;