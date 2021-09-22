import React from 'react';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '32px',
};

const NotFound = () => {
  return (
    <div style={containerStyle}>
      <p>404 | Page not Found</p>
    </div>
  );
};

export default NotFound;
