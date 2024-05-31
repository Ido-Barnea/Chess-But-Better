import React from 'react';
import { Draggable } from './draggable';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';

export interface IPieceProps {
  piece: BasePiece;
}

export const Piece: React.FC<IPieceProps> = (props) => {
  const svgMarkup = { __html: props.piece.resource.resource };

  return (
    <Draggable name={props.piece.resource.name}>
      <div
        className={`piece ${props.piece.player.color}`}
        id={props.piece.resource.name}
        dangerouslySetInnerHTML={svgMarkup}
      ></div>
    </Draggable>
  );
};
