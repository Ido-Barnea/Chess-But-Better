import React from 'react';
import '../../styles/pages/room.css';
import { LeftContainer } from './containers/left-container';
import { CenterContainer } from './containers/center-container';
import { RightContainer } from './containers/right-container';
import { MovesCounter } from '../../../controller/moves counter/MovesCounter';

export const Room = () => {
  const movesCounter = new MovesCounter();

  return (
    <div>
      <LeftContainer />
      <CenterContainer movesCounter={movesCounter} />
      <RightContainer />
    </div>
  );
};
