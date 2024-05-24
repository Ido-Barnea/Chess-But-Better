import React from 'react';
import { BoardsContainer } from '../boards/boards-container';

export const CenterColumn = () => {
  return (
    <div id="center-column">
      <BoardsContainer />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};
