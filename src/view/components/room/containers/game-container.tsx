import React from 'react';
import { BoardsContainer } from '../board/boards-container';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { Box } from '@mui/material';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IEditablePiecesStorage } from '../../../../controller/game state/storages/pieces storage/abstract/IEditablePiecesStorage';

interface GameContainerProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier,
    turnSwitcher: ITurnSwitcher,
    piecesStorage: IEditablePiecesStorage,
  }
}

export const GameContainer: React.FC<GameContainerProps> = (props) => {
  return (
    <Box className='game-container'>
      <BoardsContainer tools={props.tools} />
      <Box id="unicorn-attack" className="collapsed ability"></Box>
    </Box>
  );
};
