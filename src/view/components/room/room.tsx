import React from 'react';
import '../../styles/pages/room.css';
import { LeftContainer } from './containers/left-container';
import { CenterContainer } from './containers/center-container';
import { RightContainer } from './containers/right-container';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { Grid } from '@mui/material';
import { ITurnSwitcher } from '../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IBootstrapTools } from '../../../controller/actions/types/BootstrapTools.Type';

interface RoomProps {
  tools: IBootstrapTools;
}

// Rename to RoomPage? it is unclear that rooms contains the main page from it`s name;
export const Room: React.FC<RoomProps> = (props) => {
  return (
    <Grid container style={{ display: 'flex', width: '100vw' }}>
      <Grid item xs={12} sm={3.25}>
        <LeftContainer turnSwitcher={props.tools.turnSwitcher} />
      </Grid>
      <Grid item xs={12} sm={5.5}>
        <CenterContainer tools={props.tools} />
      </Grid>
      <Grid item xs={12} sm={3.25}>
        <RightContainer />
      </Grid>
    </Grid>
  );
};
