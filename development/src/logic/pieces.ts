import {
  pawnResource,
  bishopResource,
  knightResource,
  rookResource,
  queenResource,
  kingResource,
} from '../ui/resources';
import { Player, PlayerColors } from './players';
import {
  getCurrentPlayer,
  switchIsCastling,
  getPieceByPositionAndBoard,
  items,
  comparePositions,
  pieceMovedOnCoin,
} from './logic';
import { Item } from './items/items';
import { OVERWORLD_BOARD_ID } from './constants';
import { Coin } from './items/coin';

export type Position = {
  coordinates: [number, number],
  boardId: string,
}
export let enPassantPosition: Position | undefined;

export function resetEnPassantPosition() {
  enPassantPosition = undefined;
}
export function setEnPassantPosition(position: Position) {
  enPassantPosition = position;
}

interface PieceType {
  position: Position;
  player: Player;
  resource: string;
  name: string;
  hasMoved: boolean;
  hasKilled: boolean;
}

export class Piece implements PieceType {
  position: Position;
  player: Player;
  resource: string;
  name: string;
  hasMoved: boolean;
  hasKilled: boolean;
  pieceLogo: string;
  constructor(
    position: Position,
    player: Player,
    resource: string,
    name: string,
    pieceLogo: string,
  ) {
    this.position = position;
    this.player = player;
    this.resource = resource;
    this.name = name;
    this.hasMoved = false;
    this.hasKilled = false;
    this.pieceLogo = pieceLogo;
  }

  validateMove(_: Piece | Square | Item): Position {
    return {
      coordinates: [-1, -1],
      boardId: OVERWORLD_BOARD_ID,
    };
  }

  isValidSpawn(_: Piece | Square) {
    return false;
  }

  copyPosition(): Position {
    return {
      coordinates: Array.from(this.position.coordinates) as [number, number],
      boardId: this.position.boardId,
    };
  }
}

export type Square = {
  position: Position;
  occupent?: Piece;
};

export class Pawn extends Piece {

  enPassant: boolean;

  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♙'
      : '♟';
    super(position, player, pawnResource, 'Pawn', logo);
    this.enPassant = false;
  }

  validateMove(target: Piece | Square): Position {
    const targetCoordinates = target.position.coordinates;
    const currentCoordinates = this.position.coordinates;
    const deltaX = targetCoordinates[0] - currentCoordinates[0];
    const deltaY = targetCoordinates[1] - currentCoordinates[1];

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const stepY =
      target.position.coordinates[1] > this.position.coordinates[1]
        ? 1
        : target.position.coordinates[1] < this.position.coordinates[1]
          ? -1
          : 0;

    // Make sure pawn does not move backwards.
    const currentPlayer = getCurrentPlayer();
    if (
      (currentPlayer.color === PlayerColors.WHITE && deltaY > 0) ||
      (currentPlayer.color === PlayerColors.BLACK && deltaY < 0)
    ) {
      return this.position;
    }
    
    // Pawns can attack diagonally.
    const isDiagonalMovement = absDeltaY === 1 && absDeltaX === 1;
    this.enPassant =
     !!enPassantPosition && 
     isDiagonalMovement &&
     (targetCoordinates[0] === enPassantPosition.coordinates[0]) &&
     Math.abs(targetCoordinates[1] - enPassantPosition.coordinates[1]) === 1;

    if (
      this.enPassant ||
      target instanceof Piece
    ){
      return isDiagonalMovement
        ? target.position
        : this.position;
    }

    // Pawns can have an initial two-square move.
    if (!this.hasMoved && absDeltaY === 2 && absDeltaX === 0) {
      const validatedMove = simulateMove(
        this,
        target.position,
        0,
        stepY,
        2,
      );
      if (validatedMove === target.position) {
        enPassantPosition = validatedMove;
      }
      return validatedMove;
    }

    // Pawns can move one square forward.
    return simulateMove(
      this,
      target.position,
      0,
      stepY,
      1,
    );
  }
}

export class Bishop extends Piece {
  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♗'
      : '♝';
    super(position, player, bishopResource, 'Bishop', logo);
  }

  validateMove(target: Piece | Square): Position {
    const targetCoordinates = target.position.coordinates;
    const currentCoordinates = this.position.coordinates;
    const stepX = targetCoordinates[0] > currentCoordinates[0] ? 1 : -1;
    const stepY = targetCoordinates[1] > currentCoordinates[1] ? 1 : -1;

    const absDeltaX = Math.abs(targetCoordinates[0] - currentCoordinates[0]);
    const absDeltaY = Math.abs(targetCoordinates[1] - currentCoordinates[1]);

    // Bishops can only move diagonally.
    if (absDeltaY === absDeltaX) {
      return simulateMove(
        this,
        target.position,
        stepX,
        stepY,
        -1,
      );
    }

    return this.position;
  }
}

export class Knight extends Piece {
  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♘'
      : '♞';
    super(position, player, knightResource, 'Knight', logo);
  }

  validateMove(target: Piece | Square): Position {
    const targetCoordinates = target.position.coordinates;
    const currentCoordinates = this.position.coordinates;
    const absDeltaX = Math.abs(targetCoordinates[0] - currentCoordinates[0]);
    const absDeltaY = Math.abs(targetCoordinates[1] - currentCoordinates[1]);

    // Knights can move two squares in any direction and one square to the side.
    return absDeltaY * absDeltaX === 2 ? target.position : this.position;
  }
}

export class Rook extends Piece {
  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♖'
      : '♜';
    super(position, player, rookResource, 'Rook', logo);
  }

  validateMove(target: Piece | Square): Position {
    const stepX =
      target.position.coordinates[0] > this.position.coordinates[0]
        ? 1
        : target.position.coordinates[0] < this.position.coordinates[0]
          ? -1
          : 0;
    const stepY =
      target.position.coordinates[1] > this.position.coordinates[1]
        ? 1
        : target.position.coordinates[1] < this.position.coordinates[1]
          ? -1
          : 0;

    // Rooks can move either vertically or horizontally but not both at the same.
    if (
      this.position.coordinates[1] === target.position.coordinates[1] ||
      this.position.coordinates[0] === target.position.coordinates[0]
    ) {
      return simulateMove(
        this,
        target.position,
        stepX,
        stepY,
        -1,
      );
    }

    return this.position;
  }
}

export class Queen extends Piece {
  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♕'
      : '♛';

    super(position, player, queenResource, 'Queen', logo);
  }

  validateMove(target: Piece | Square): Position {
    const targetCoordinates = target.position.coordinates;
    const currentCoordinates = this.position.coordinates;

    const stepX =
      targetCoordinates[0] > currentCoordinates[0]
        ? 1
        : targetCoordinates[0] < currentCoordinates[0]
          ? -1
          : 0;
    const stepY =
      targetCoordinates[1] > currentCoordinates[1]
        ? 1
        : targetCoordinates[1] < currentCoordinates[1]
          ? -1
          : 0;

    const absDeltaX = Math.abs(targetCoordinates[0] - currentCoordinates[0]);
    const absDeltaY = Math.abs(targetCoordinates[1] - currentCoordinates[1]);

    // Queens can move vertically, horizontally or diagonally.
    if (
      this.position.coordinates[1] === target.position.coordinates[1] ||
      this.position.coordinates[0] === target.position.coordinates[0] ||
      absDeltaY === absDeltaX
    ) {
      return simulateMove(
        this,
        target.position,
        stepX,
        stepY,
        -1,
      );
    }

    return this.position;
  }
}

export class King extends Piece {
  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♔'
      : '♚';

    super(position, player, kingResource, 'King', logo);
  }

  validateMove(target: Piece | Square): Position {
    const targetCoordinates = target.position.coordinates;
    const currentCoordinates = this.position.coordinates;

    const stepX =
      targetCoordinates[0] > currentCoordinates[0]
        ? 1
        : targetCoordinates[0] < currentCoordinates[0]
          ? -1
          : 0;
    const stepY =
      targetCoordinates[1] > currentCoordinates[1]
        ? 1
        : targetCoordinates[1] < currentCoordinates[1]
          ? -1
          : 0;

    const deltaX = targetCoordinates[0] - currentCoordinates[0];
    const deltaY = targetCoordinates[1] - currentCoordinates[1];

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // King can only move one step but in any direction.
    if (absDeltaX === 1 || absDeltaY === 1) {
      return simulateMove(
        this,
        target.position,
        stepX,
        stepY,
        1,
      );
    }

    // Check for castling
    if (absDeltaX === 2 && absDeltaY === 0 && !this.hasMoved) {
      let destinationPosition = this.position;
      // Moved two squares horizontally and didn't move before
      if (deltaX === 2) {
        // Kingside castling
        destinationPosition = simulateMove(
          this,
          target.position,
          stepX,
          stepY,
          2,
          false,
        );
      } else {
        // Queenside castling
        // Queenside castling needs to check an extra square
        const targetPosition: Position = {
          coordinates: [
            target.position.coordinates[0] - 1,
            target.position.coordinates[1],
          ],
          boardId: target.position.boardId,
        };
        destinationPosition = simulateMove(
          this,
          targetPosition,
          stepX,
          stepY,
          3,
          false,
        );
      }

      if (!comparePositions(destinationPosition, this.position)) {
        switchIsCastling();
      }
      return destinationPosition;
    }

    return this.position;
  }
}

function simulateMove(
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
