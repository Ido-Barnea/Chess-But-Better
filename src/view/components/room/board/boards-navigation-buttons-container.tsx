import React from 'react';

export const BoardsNavigationButtonsContainer = () => {
  return (
    <div id="boards-buttons-container">
      <button id="board-hell-button" className="disabled" value="board-hell">Hell</button>
      <button id="board-overworld-button" value="board-overworld">Overworld</button>
      <button id="board-heaven-button" className="disabled" value="board-heaven">Heaven</button>
    </div>
  );
};
