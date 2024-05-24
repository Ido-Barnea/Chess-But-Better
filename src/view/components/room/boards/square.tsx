import React from 'react';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { Piece } from '../pieces/piece';

export interface ISquareProps {
  coordinates: { x: number, y: number };
  backgroundColor: string;
  occupant?: BasePiece;
}

export const Square: React.FC<ISquareProps> = ({ coordinates, backgroundColor, occupant }) => {
  return (
    <div className={`square ${backgroundColor}`} square-id={`${coordinates.x},${coordinates.y}`}>
      { occupant && (
        <Piece name={occupant.resource.name} resource={occupant.resource.resource} color={occupant.player.color} />
      ) }
    </div>
  );
};
