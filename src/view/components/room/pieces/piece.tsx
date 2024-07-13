import React, { useEffect, useState } from 'react';
import { Draggable } from '../other/draggable/draggable';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { DraggableType } from '../other/draggable/DraggableType';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { Player } from '../../../../controller/game state/storages/players storage/Player';
import { Box } from '@mui/material';

export interface IPieceProps {
  piece: BasePiece;
  turnSwitcher: ITurnSwitcher;
}

export const Piece: React.FC<IPieceProps> = (props) => {
  const svgMarkup = { __html: props.piece.resource.resource };

  const [isPieceDraggable, setIsPieceDraggable] = useState(true);

  useEffect(() => {
    const handleTurnChange = (currentPlayer: Player) => {
      const currentTurnPlayerColor = currentPlayer.color;
      const isPieceOfCurrentPlayer = props.piece.player.color === currentTurnPlayerColor;

      setIsPieceDraggable(isPieceOfCurrentPlayer);
    };
    
    props.turnSwitcher.subscribeToTurnChanges({
      onTurnChange: handleTurnChange,
    });

    return () => {
      props.turnSwitcher.unsubscribeFromTurnChanges({
        onTurnChange: handleTurnChange,
      });
    };
  }, [props.turnSwitcher]);

  return (
    <Draggable
      type={DraggableType.PIECE}
      coordinates={props.piece.position?.coordinates}
      isDraggable={isPieceDraggable}>
      <Box
        className={`piece ${props.piece.player.color}`}
        id={props.piece.resource.name}
        dangerouslySetInnerHTML={svgMarkup}
      ></Box>
    </Draggable>
  );
};
