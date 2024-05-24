import React from 'react';
import { BoardsNavigationButtonsContainer } from '../boards/boards-navigation-buttons-container';

export const RightColumn = () => {
  return (
    <div id="right-column">
      <div id="logs-container"></div>
      <BoardsNavigationButtonsContainer />
    </div>
  );
};
