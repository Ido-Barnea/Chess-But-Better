import React from 'react';
import { BoardsContainer } from '../boards/boards-container';
import { game } from '../../../../controller/Game';

export const CenterColumn = () => {
  return (
    <div id="center-column">
      <BoardsContainer pieces={game.getPieces()} />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};
