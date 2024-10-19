import React from 'react';
import '../../styles/pages/room.css';
import { PlayerContainer } from './containers/player-container';
import { GameContainer } from './containers/game-container';
import { UtilityContainer } from './containers/utility-container';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { Grid } from '@mui/material';
import { ITurnSwitcher } from '../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IEditablePiecesStorage } from '../../../controller/game state/storages/pieces storage/abstract/IEditablePiecesStorage';

interface RoomProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier,
    turnSwitcher: ITurnSwitcher,
    piecesStorage: IEditablePiecesStorage,
  }
}

export const Room: React.FC<RoomProps> = (props) => {
  return (
    <Grid container style={{ display: 'flex', width: '100vw' }}>
      <Grid item xs={12} sm={3.25}>
        <PlayerContainer turnSwitcher={props.tools.turnSwitcher} />
      </Grid>
      <Grid item xs={12} sm={5.5}>
        <GameContainer tools={props.tools} />
      </Grid>
      <Grid item xs={12} sm={3.25}>
        <UtilityContainer />
      </Grid>
    </Grid>
  );
};
