import React from 'react';
import { Board } from './board';

export const BoardsContainer = () => {
  return (
    <div id="boards-container">
      <div className="bottom-notations-container" id="bottom-notations"></div>
      <div className="left-notations-container" id="left-notations"></div>
      
      <Board boardId="board-overworld" isCollapsed={false} />
      <Board boardId="board-hell" />
      <Board boardId="board-heaven" />
    </div>
  );
};
