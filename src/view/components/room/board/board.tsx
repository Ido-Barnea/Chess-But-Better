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
import { IPiecesStorage } from '../../../../controller/game state/storages/pieces storage/abstract/IPiecesStorage';
import { Bootstrapper } from '../../../../controller/Bootstrapper';
import { IBootstrapTools } from '../../../../controller/actions/types/BootstrapTools.Type';

interface IBoardsProps {
  boardId: string;
  lightSquareColor: string;
  darkSquareColor: string;
  tools: IBootstrapTools;
  pieces?: Array<BasePiece>;
  isCollapsed?: boolean;
  size?: number;
}

// Pass props and do conditional rendering instead?
export const Board: React.FC<IBoardsProps> = ({
  boardId,
  lightSquareColor,
  darkSquareColor,
  tools,
  pieces = [],
  isCollapsed = true,
  size = 8,
}) => {
  const [squares, setSquares] = useState<Array<Square>>(
    generateSquares(size, boardId, pieces || []),
  );

  const handlePiecePlaced = (
    startCoordinates: Coordinates | undefined,
    endCoordinates: Coordinates,
  ) => {
    // const pieceToPlace = pieces?.find((piece) =>
    //   isEqual(piece.position?.coordinates, startCoordinates),
    // );

    const startSquare = squares.find((square) =>
      isEqual(square.position?.coordinates, startCoordinates),
    );
    const endSquare = squares.find((square) =>
      isEqual(square.position?.coordinates, endCoordinates),
    );

    if (!startSquare || !startSquare.occupant || !endSquare) return;

    const validators = new ValidatorChain(
      new PieceMoveValidator(
        startSquare.occupant,
        endSquare,
        tools.piecesStorage,
      ),
      new PlayerMovesValidator(startSquare.occupant, tools.movesCounter),
    );

    if (!validators.validate() || !startSquare.occupant.position) return;

    startSquare.occupant.position.boardId = boardId;
    startSquare.occupant.position.coordinates = endCoordinates;

    endSquare.occupant = startSquare.occupant;
    startSquare.occupant = undefined;

    const updatedSquares = [...squares];
    setSquares(updatedSquares);

    tools.endOfMoveHandlersNotifier.notifyHandlers();
  };

  return (
    <div className={`board ${isCollapsed ? 'collapsed' : ''}`} id={boardId}>
      <DndProvider
        backend={HTML5Backend}
        options={{ enableTouchEvents: false, enableMouseEvents: true }}
      >
        {squares.map((square) => {
          const backgroundColor = calculateSquareBackgroundColorByCoordinates(
            square.position.coordinates,
            lightSquareColor,
            darkSquareColor,
          );

          return (
            <SquareContainer
              key={`${square.position.coordinates.x},${square.position.coordinates.y}`}
              coordinates={square.position.coordinates}
              backgroundColor={backgroundColor}
              onPiecePlaced={handlePiecePlaced}
            >
              {square.occupant && (
                <Piece
                  piece={square.occupant}
                  turnSwitcher={tools.turnSwitcher}
                />
              )}
            </SquareContainer>
          );
        })}
      </DndProvider>
    </div>
  );
};
