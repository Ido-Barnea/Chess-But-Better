import React from 'react';
import '../../styles/pages/room.css';
import { LeftContainer } from './containers/left-container';
import { CenterContainer } from './containers/center-container';
import { RightContainer } from './containers/right-container';

export const Room = () => {
  return (
    <div>
      <LeftContainer />
      <CenterContainer />
      <RightContainer />
    </div>
  );
};
