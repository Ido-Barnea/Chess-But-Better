import React from 'react';
import { Square } from './square';
import { generateSquares } from './SquaresGenerator';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { calculateSquareBackgroundColorByCoordinates } from './Utils';
import { Piece } from '../pieces/piece';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface IBoardsProps {
  boardId: string;
  lightSquareColor: string;
  darkSquareColor: string;
  pieces?: Array<BasePiece>,
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
        generateSquares(size, boardId, pieces || []).map(square => {
          const backgroundColor = calculateSquareBackgroundColorByCoordinates(
            square.position.coordinates,
            lightSquareColor,
            darkSquareColor,
          );

          return (
            <Square
              key={ `${square.position.coordinates.x},${square.position.coordinates.y}` }
              coordinates={ square.position.coordinates }
              backgroundColor={backgroundColor}>
                {
                  square.occupant && (
                    <DndProvider backend={HTML5Backend} options={{ enableTouchEvents: false, enableMouseEvents: true }}>
                      <Piece piece={square.occupant} />
                    </DndProvider>
                  )
                }
            </Square>
          );
        })
      }
    </div>
  );
};
