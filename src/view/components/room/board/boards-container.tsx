import React from 'react';
import { Board } from './board';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IEditablePiecesStorage } from '../../../../controller/game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { Box } from '@mui/material';

interface IBoardsContainerProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier,
    turnSwitcher: ITurnSwitcher,
    piecesStorage: IEditablePiecesStorage,
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
    <Box id="boards-container">
      <Box className="bottom-notations-container" id="bottom-notations"></Box>
      <Box className="left-notations-container" id="left-notations"></Box>
      
      <Board
        boardId="board-overworld"
        lightSquareColor={LIGHT_OVERWORLD_SQUARE_COLOR}
        darkSquareColor={DARK_OVERWORLD_SQUARE_COLOR}
        tools={props.tools}
        pieces={props.tools.piecesStorage.getPieces()}
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
    </Box>
  );
};
