import React from 'react';
import { Board } from './board';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../../controller/moves counter/abstract/IMovesCounter';

interface IBoardsContainerProps {
  pieces: Array<BasePiece>;
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier
  }
}

export const BoardsContainer: React.FC<IBoardsContainerProps> = (props) => {
  const LIGHT_OVERWORLD_SQUARE_COLOR = 'beige-background';
  const DARK_OVERWORLD_SQUARE_COLOR = 'brown-background';
  const LIGHT_HELL_SQUARE_COLOR = 'dark-orange-background';
  const DARK_HELL_SQUARE_COLOR = 'dark-red-background';
  const LIGHT_HEAVEN_SQUARE_COLOR = 'water-background';
  const DARK_HEAVEN_SQUARE_COLOR = 'blue-background';

  return (
    <div id="boards-container">
      <div className="bottom-notations-container" id="bottom-notations"></div>
      <div className="left-notations-container" id="left-notations"></div>
      
      <Board
        boardId="board-overworld"
        lightSquareColor={LIGHT_OVERWORLD_SQUARE_COLOR}
        darkSquareColor={DARK_OVERWORLD_SQUARE_COLOR}
        tools={props.tools}
        pieces={props.pieces}
        isCollapsed={false} />
      <Board
        boardId="board-hell"
        lightSquareColor={LIGHT_HELL_SQUARE_COLOR}
        darkSquareColor={DARK_HELL_SQUARE_COLOR}
        tools={props.tools} />
      <Board
        boardId="board-heaven"
        lightSquareColor={LIGHT_HEAVEN_SQUARE_COLOR}
        darkSquareColor={DARK_HEAVEN_SQUARE_COLOR}
        tools={props.tools} />
    </div>
  );
};
