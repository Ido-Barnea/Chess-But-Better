import React from 'react';
import { Square } from './square';
import { generateSquares } from './SquaresGenerator';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { calculateSquareBackgroundColorByCoordinates } from './Utils';

interface IBoardsProps {
  boardId: string;
  lightSquareColor: string;
  darkSquareColor: string;
  pieces: Array<BasePiece>,
  isCollapsed?: boolean;
  size?: number;
}

export const Board: React.FC<IBoardsProps> = ({
  boardId,
  lightSquareColor,
  darkSquareColor,
  pieces,
  isCollapsed=true,
  size=8,
}) => {
  return (
    <div className={`board ${isCollapsed ? 'collapsed' : ''}`} id={boardId}>
      {
        generateSquares(size, boardId, pieces).map(square => {
          const backgroundColor = calculateSquareBackgroundColorByCoordinates(
            square.position.coordinates,
            lightSquareColor,
            darkSquareColor,
          );

          return <Square coordinates={ square.position.coordinates } backgroundColor={backgroundColor} occupant={square.occupant} />;
        })
      }
    </div>
  );
};
