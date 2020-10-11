import React from 'react';
import FlexContainer from '../components/flex-container';
import PaddedPaper from '../components/padded-paper';

// styles

const Landing = () => {
  return (
    <FlexContainer>
      <PaddedPaper elevation={3}>
        <p>Hello there!!</p>
      </PaddedPaper>
    </FlexContainer>
  );
};

export default Landing;
