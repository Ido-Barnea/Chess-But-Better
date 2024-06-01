import React, { useState } from 'react';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { Piece } from '../pieces/piece';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Square } from '../../../../model/types/Square';
import isEqual from 'lodash/isEqual';
import { Coordinates } from '../../../../model/types/Coordinates';
import { calculateSquareBackgroundColorByCoordinates } from './square/Utils';
import { SquareContainer } from './square/square-container';
import { generateSquares } from './square/SquaresGenerator';

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
  pieces=[],
  isCollapsed=true,
  size=8,
}) => {
  const [squares, setSquares] = useState<Array<Square>>(generateSquares(size, boardId, pieces || []));

  const handleItemPlaced = (startCoordinates: Coordinates | undefined, endCoordinates: Coordinates) => {
    const pieceToPlace = pieces?.find(piece => isEqual(piece.position?.coordinates, startCoordinates)); 
    const startSquareIndex = squares.findIndex(square => isEqual(square.position?.coordinates, startCoordinates));
    const endSquareIndex = squares.findIndex(square => isEqual(square.position?.coordinates, endCoordinates));
    
    if (pieceToPlace && pieceToPlace.position && endSquareIndex !== -1) {
      pieceToPlace.position.boardId = boardId;
      pieceToPlace.position.coordinates = endCoordinates;

      const startSquare = squares[endSquareIndex];
      startSquare.occupant = pieceToPlace;

      if (startSquareIndex !== -1) {
        const endSquare = squares[startSquareIndex];
        endSquare.occupant = undefined;
      }

      const updatedSquares = [...squares];
      updatedSquares[endSquareIndex] = startSquare;
      setSquares(updatedSquares);
    }
  };

  return (
    <div className={`board ${isCollapsed ? 'collapsed' : ''}`} id={boardId}>
      <DndProvider backend={HTML5Backend} options={{ enableTouchEvents: false, enableMouseEvents: true }}>
        {
          squares.map(square => {
            const backgroundColor = calculateSquareBackgroundColorByCoordinates(
              square.position.coordinates,
              lightSquareColor,
              darkSquareColor,
            );

            return (
              <SquareContainer
                key={ `${square.position.coordinates.x},${square.position.coordinates.y}` }
                coordinates={ square.position.coordinates }
                backgroundColor={backgroundColor}
                onPiecePlaced={handleItemPlaced}>
                  {
                    square.occupant && (
                      <Piece piece={square.occupant} />
                    )
                  }
              </SquareContainer>
            );
          })
        }
      </DndProvider>
    </div>
  );
};
