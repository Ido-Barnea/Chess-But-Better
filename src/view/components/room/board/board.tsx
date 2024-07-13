import React, { useState } from 'react';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { Piece } from '../pieces/piece';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Square } from '../../../../model/types/Square';
import { isEqual } from 'lodash';
import { Coordinates } from '../../../../model/types/Coordinates';
import { calculateSquareBackgroundColorByCoordinates } from './square/Utils';
import { SquareContainer } from './square/square-container';
import { generateSquares } from './square/SquaresGenerator';
import { PieceMoveValidator } from '../../../../controller/validators/PieceMoveValidator';
import { PlayerMovesValidator } from '../../../../controller/validators/PlayerMovesValidator';
import { ValidatorChain } from '../../../../controller/validators/ValidatorChain';
import { IMovesCounter } from '../../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { IEndOfMoveHandlersNotifier } from '../../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IEditablePiecesStorage } from '../../../../controller/game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { Box } from '@mui/material';

interface IBoardsProps {
  boardId: string;
  lightSquareColor: string;
  darkSquareColor: string;
  tools: {
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier,
    turnSwitcher: ITurnSwitcher,
    piecesStorage: IEditablePiecesStorage,
  }
  pieces?: Array<BasePiece>,
  isCollapsed?: boolean;
  size?: number;
}

export const Board: React.FC<IBoardsProps> = ({
  boardId,
  lightSquareColor,
  darkSquareColor,
  tools,
  pieces=[],
  isCollapsed=true,
  size=8,
}) => {
  const [squares, setSquares] = useState<Array<Square>>(generateSquares(size, boardId, pieces || []));

  const handlePiecePlaced = (startCoordinates: Coordinates | undefined, endCoordinates: Coordinates) => {
    const pieceToPlace = pieces?.find(piece => isEqual(piece.position?.coordinates, startCoordinates)); 
    const startSquareIndex = squares.findIndex(square => isEqual(square.position?.coordinates, startCoordinates));
    const endSquareIndex = squares.findIndex(square => isEqual(square.position?.coordinates, endCoordinates));
    
    if (pieceToPlace && endSquareIndex !== -1) {
      const endSquare = squares[endSquareIndex];

      const validators = new ValidatorChain(
        new PieceMoveValidator(pieceToPlace, endSquare, tools.piecesStorage),
        new PlayerMovesValidator(pieceToPlace, tools.movesCounter),
      );

      if (!validators.validate() || !pieceToPlace.position) return;

      pieceToPlace.position.boardId = boardId;
      pieceToPlace.position.coordinates = endCoordinates;

      endSquare.occupant = pieceToPlace;

      if (startSquareIndex !== -1) {
        const startSquare = squares[startSquareIndex];
        startSquare.occupant = undefined;
      }

      const updatedSquares = [...squares];
      setSquares(updatedSquares);

      tools.endOfMoveHandlersNotifier.notifyHandlers();
    }
  };

  return (
    <Box className={`board ${isCollapsed ? 'collapsed' : ''}`} id={boardId}>
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
                onPiecePlaced={handlePiecePlaced}>
                  {
                    square.occupant && (
                      <Piece piece={square.occupant} turnSwitcher={tools.turnSwitcher} />
                    )
                  }
              </SquareContainer>
            );
          })
        }
      </DndProvider>
    </Box>
  );
};
