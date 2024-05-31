import React from 'react';
import { Draggable } from '../other/draggable/draggable';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { DraggableType } from '../other/draggable/DraggableType';
import { game } from '../../../../controller/Game';

export interface IPieceProps {
  piece: BasePiece;
}

export const Piece: React.FC<IPieceProps> = (props) => {
  const svgMarkup = { __html: props.piece.resource.resource };

  const isPieceDraggable = () => {
    const currentTurnPlayerColor = game
      .getPlayersTurnSwitcher()
      .getCurrentPlayer()
      .color;
    const isPieceOfCurrentPlayer = props.piece.player.color === currentTurnPlayerColor;

    return isPieceOfCurrentPlayer;
  }

  return (
    <Draggable
      type={DraggableType.PIECE}
      coordinates={props.piece.position?.coordinates}
      isDraggable={isPieceDraggable}>
      <div
        className={`piece ${props.piece.player.color}`}
        id={props.piece.resource.name}
        dangerouslySetInnerHTML={svgMarkup}
      ></div>
    </Draggable>
  );
};
