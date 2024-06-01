import React from 'react';
import { game } from '../../../../controller/Game';
import { BoardsContainer } from '../board/boards-container';

export const CenterContainer = () => {
  return (
    <div className='center-container'>
      <BoardsContainer pieces={game.getPieces()} />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};
