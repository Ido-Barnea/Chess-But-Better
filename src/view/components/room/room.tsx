import React from 'react';
import '../../styles/pages/room.css';
import { LeftContainer } from './containers/left-container';
import { CenterContainer } from './containers/center-container';
import { RightContainer } from './containers/right-container';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { Grid } from '@mui/material';

interface RoomProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier
  }
}

export const Room: React.FC<RoomProps> = (props) => {
  return (
    <Grid container style={{ display: 'flex', width: '100vw' }}>
      <Grid item xs={12} sm={3}>
        <LeftContainer />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CenterContainer tools={props.tools} />
      </Grid>
      <Grid item xs={12} sm={3}>
        <RightContainer />
      </Grid>
    </Grid>
  );
};
