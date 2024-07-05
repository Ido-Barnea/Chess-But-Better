import React from 'react';
import { Bootstrapper } from '../../../../controller/Bootstrapper';
import { BoardsContainer } from '../board/boards-container';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { Box } from '@mui/material';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IBootstrapTools } from '../../../../controller/actions/types/BootstrapTools.Type';

interface CenterContainerProps {
  tools: IBootstrapTools;
}

export const CenterContainer: React.FC<CenterContainerProps> = (props) => {
  return (
    <Box className="center-container">
      <BoardsContainer tools={props.tools} />
      <Box id="unicorn-attack" className="collapsed ability"></Box>
    </Box>
  );
};
