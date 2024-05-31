import React from 'react';
import { BoardsContainer } from '../boards/boards-container';
import { game } from '../../../../controller/Game';

export const CenterContainer = () => {
  return (
    <div className='center-container'>
      <BoardsContainer pieces={game.getPieces()} />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};
