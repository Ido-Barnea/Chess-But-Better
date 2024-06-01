import React from 'react';
import { BoardsNavigationButtonsContainer } from '../board/boards-navigation-buttons-container';

export const RightContainer = () => {
  return (
    <div className='right-container'>
      <div id="logs-container"></div>
      <BoardsNavigationButtonsContainer />
    </div>
  );
};
