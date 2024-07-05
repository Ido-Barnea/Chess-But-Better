import React from 'react';
import { game } from '../../../../controller-legacy/Game';
import { BoardsContainer } from '../board/boards-container';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { Box } from '@mui/material';

interface CenterContainerProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier
  }
}

export const CenterContainer: React.FC<CenterContainerProps> = (props) => {
  return (
    <Box className='center-container'>
      <BoardsContainer pieces={game.getPieces()} tools={props.tools} />
      <Box id="unicorn-attack" className="collapsed ability"></Box>
    </Box>
  );
};
