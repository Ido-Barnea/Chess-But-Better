import React from 'react';
import '../../styles/pages/room.css';
import { LeftContainer } from './containers/left-container';
import { CenterContainer } from './containers/center-container';
import { RightContainer } from './containers/right-container';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/moves counter/abstract/IMovesCounter';

interface RoomProps {
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier
  }
}

export const Room: React.FC<RoomProps> = (props) => {
  return (
    <div>
      <LeftContainer />
      <CenterContainer tools={props.tools} />
      <RightContainer />
    </div>
  );
};
