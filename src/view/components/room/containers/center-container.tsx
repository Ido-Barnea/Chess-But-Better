import React from 'react';
import { game } from '../../../../controller-legacy/Game';
import { BoardsContainer } from '../board/boards-container';
import { IMovesCounter } from '../../../../controller/moves counter/abstract/IMovesCounter';

interface CenterContainerProps {
  movesCounter: IMovesCounter;
}

export const CenterContainer: React.FC<CenterContainerProps> = (props) => {
  return (
    <div className='center-container'>
      <BoardsContainer pieces={game.getPieces()} movesCounter={props.movesCounter} />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};
