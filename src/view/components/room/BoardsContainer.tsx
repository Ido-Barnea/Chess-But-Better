import React from 'react';

const BoardsContainer = () => {
  return (
    <div id="boards-container">
      <div className="bottom-notations-container" id="bottom-notations"></div>
      <div className="left-notations-container" id="left-notations"></div>
      <div className="board" id="board-overworld"></div>
      <div className="board collapsed" id="board-hell"></div>
      <div className="board collapsed" id="board-heaven"></div>
    </div>
  );
};

export default BoardsContainer;
