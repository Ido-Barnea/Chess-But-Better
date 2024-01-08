import { Piece } from './Pieces';
import { Player } from '../Players';
import { Coin } from '../items/Coin';
import { Item } from '../items/Items';
import { comparePositions, getPieceByPositionAndBoard, items, pieceMovedOnCoin } from '../Logic';

export type Position = {
  coordinates: [number, number],
  boardId: string,
}

export type Square = {
  position: Position;
  occupent?: Piece;
};

export interface PieceType {
  position: Position;
  player: Player;
  resource: string;
  name: string;
  hasMoved: boolean;
  hasKilled: boolean;
}

export function simulateMove(
  draggedPiece: Piece,
  targetPosition: Position,
  stepX: number,
  stepY: number,
  limit: number,
  allowedToAttackOnLastStep = true,
): Position {
  let limitCounter = 0;
  const position = draggedPiece.copyPosition();
  const startingPosition = draggedPiece.copyPosition();
  const pickedUpCoins: Coin[] = [];
  while (
    (position.coordinates[0] !== targetPosition.coordinates[0] ||
      position.coordinates[1] !== targetPosition.coordinates[1]) &&
    limitCounter !== limit &&
    draggedPiece.name !== 'Knight'
  ) {
    const nextXPosition = position.coordinates[0] + stepX;
    const nextYPosition = position.coordinates[1] + stepY;
    const nextPosition: Position = {
      coordinates: [nextXPosition, nextYPosition],
      boardId: position.boardId,
    };

    // Check if any square along the piece's path is occupied (not including the destination square)
    const targetPiece = getPieceByPositionAndBoard(nextPosition);
    if (
      targetPiece &&
      (!comparePositions(nextPosition, targetPosition) ||
        !allowedToAttackOnLastStep)
    ) {
      return startingPosition;
    }

    const squareItem = handleItemOnSquare(nextPosition);
    if (squareItem) {
      switch (squareItem.name) {
        case ('trap'): {
          return nextPosition;
        }
        case ('gold coin'): {
          pickedUpCoins.push(squareItem);
        }
      }
    }

    position.coordinates[0] += stepX;
    position.coordinates[1] += stepY;
    limitCounter++;
  }

  if (comparePositions(position, targetPosition)) {
    pickedUpCoins.forEach(coin => {
      pieceMovedOnCoin(draggedPiece, coin);
    });

    return targetPosition;
  }

  return startingPosition;
}

function handleItemOnSquare(
  nextPosition: Position,
): Item | undefined {
  return checkIfPositionContainsItem(nextPosition);
}

function checkIfPositionContainsItem(position: Position): Item | undefined {
  return items.find((item) => comparePositions(position, item.position));
}

