// imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fetch = ({ id = 1 }) => {
  // state
  const [userState, setUserState] = useState({
    user: {},
    initialzed: false,
  });
  // fetch
  const getUser = async (id) => {
    setUserState({ ...userState, initialized: false });
    const apiResponse = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    );
    const { error, data: user } = apiResponse;
    if (error) {
      console.log(error);
      setUserState({ user: {}, initialized: true });
      return;
    }
    setUserState({ user, initialized: true });
  };
  useEffect(() => {
    getUser(id);
  }, []);
  // jsx
  return (
    <div>
      {userState.initialized ? (
        userState.user.name ? (
          // initialized && user
          <p>User: {userState.user.name}</p>
        ) : (
          // initialized && !user
          <p>No user found</p>
        )
      ) : (
        // not initialized
        <p>...</p>
      )}
    </div>
  );
};

export default Fetch;
