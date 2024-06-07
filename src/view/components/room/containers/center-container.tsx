import React from 'react';
import { game } from '../../../../controller-legacy/Game';
import { BoardsContainer } from '../board/boards-container';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../../controller/moves counter/abstract/IMovesCounter';

interface CenterContainerProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier
  }
}

export const CenterContainer: React.FC<CenterContainerProps> = (props) => {
  return (
    <div className='center-container'>
      <BoardsContainer pieces={game.getPieces()} tools={props.tools} />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};
