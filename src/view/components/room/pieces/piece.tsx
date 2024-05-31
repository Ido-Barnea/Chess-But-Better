import React from 'react';
import { Draggable } from '../other/draggable/draggable';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { DraggableType } from '../other/draggable/DraggableType';

export interface IPieceProps {
  piece: BasePiece;
}

export const Piece: React.FC<IPieceProps> = (props) => {
  const svgMarkup = { __html: props.piece.resource.resource };

  return (
    <Draggable type={DraggableType.PIECE} coordinates={props.piece.position?.coordinates}>
      <div
        className={`piece ${props.piece.player.color}`}
        id={props.piece.resource.name}
        dangerouslySetInnerHTML={svgMarkup}
      ></div>
    </Draggable>
  );
};
