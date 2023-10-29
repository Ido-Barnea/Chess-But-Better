import {
  pawnResource,
  bishopResource,
  knightResource,
  rookResource,
  queenResource,
  kingResource,
} from "./resources";
import { Player } from "./players";
import {
  getCurrentPlayer,
  switchIsCastling,
  getPieceByPositionAndBoard,
  items,
  comparePositions,
  PlayerColors,
} from "./logic";
import { OVERWORLD_BOARD_ID } from "./boards";
import { Item } from "./items";

export type Position = {
  coordinates: [number, number];
  board: string;
};

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

  constructor(
    position: Position,
    player: Player,
    resource: string,
    name: string,
  ) {
    this.position = position;
    this.player = player;
    this.resource = resource;
    this.name = name;
    this.hasMoved = false;
    this.hasKilled = false;
  }

  validateMove(_: Piece | Square | Item): Position {
    return {
      coordinates: [-1, -1],
      board: OVERWORLD_BOARD_ID,
    };
  }

  isValidSpawn(_: Piece | Square) {
    return false;
  }

  copyPosition(): Position {
    return {
      coordinates: Array.from(this.position.coordinates) as [number, number],
      board: this.position.board,
    };
  }
}

export type Square = {
  position: Position;
  occupent?: Piece;
};

export class Pawn extends Piece {
  constructor(position: Position, player: Player) {
    super(position, player, pawnResource, "Pawn");
  }

  validateMove(target: Piece | Square) {
    const deltaX =
      target.position.coordinates[0] - this.position.coordinates[0];
    const deltaY =
      target.position.coordinates[1] - this.position.coordinates[1];

    const absoluteDeltaX = Math.abs(deltaX);
    const absoluteDeltaY = Math.abs(deltaY);

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

    // Pawns attack diagonally.
    if ((target as Piece).name !== undefined) {
      return absoluteDeltaY === 1 && absoluteDeltaX === 1
        ? target.position
        : this.position;
    }

    // Pawns can have an initial two-square move.
    if (!this.hasMoved && absoluteDeltaY === 2 && absoluteDeltaX === 0) {
      return simulateMove(this.copyPosition(), target.position, 0, stepY, 2);
    }

    // Pawns move one square forward.
    return absoluteDeltaY === 1 && absoluteDeltaX === 0
      ? target.position
      : this.position;
  }
}

export class Bishop extends Piece {
  constructor(position: Position, player: Player) {
    super(position, player, bishopResource, "Bishop");
  }

  validateMove(target: Piece | Square) {
    const stepX =
      target.position.coordinates[0] > this.position.coordinates[0] ? 1 : -1;
    const stepY =
      target.position.coordinates[1] > this.position.coordinates[1] ? 1 : -1;

    const absoluteDeltaX = Math.abs(
      target.position.coordinates[0] - this.position.coordinates[0],
    );
    const absoluteDeltaY = Math.abs(
      target.position.coordinates[1] - this.position.coordinates[1],
    );

    // Bishops can only move diagonally.
    if (absoluteDeltaY === absoluteDeltaX) {
      return simulateMove(
        this.copyPosition(),
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
    super(position, player, knightResource, "Knight");
  }

  validateMove(target: Piece | Square) {
    const absoluteDeltaX = Math.abs(
      target.position.coordinates[0] - this.position.coordinates[0],
    );
    const absoluteDeltaY = Math.abs(
      target.position.coordinates[1] - this.position.coordinates[1],
    );

    // Knights can move two squares in any direction and one square to the side.
    return absoluteDeltaY * absoluteDeltaX === 2
      ? target.position
      : this.position;
  }
}

export class Rook extends Piece {
  constructor(position: Position, player: Player) {
    super(position, player, rookResource, "Rook");
  }

  validateMove(target: Piece | Square) {
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
        this.copyPosition(),
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
    super(position, player, queenResource, "Queen");
  }

  validateMove(target: Piece | Square) {
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

    const absoluteDeltaX = Math.abs(
      target.position.coordinates[0] - this.position.coordinates[0],
    );
    const absoluteDeltaY = Math.abs(
      target.position.coordinates[1] - this.position.coordinates[1],
    );

    // Queens can move vertically, horizontally or diagonally.
    if (
      this.position.coordinates[1] === target.position.coordinates[1] ||
      this.position.coordinates[0] === target.position.coordinates[0] ||
      absoluteDeltaY === absoluteDeltaX
    ) {
      return simulateMove(
        this.copyPosition(),
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
    super(position, player, kingResource, "King");
  }

  validateMove(target: Piece | Square) {
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

    const deltaX =
      target.position.coordinates[0] - this.position.coordinates[0];
    const deltaY =
      target.position.coordinates[1] - this.position.coordinates[1];

    const absoluteDeltaX = Math.abs(deltaX);
    const absoluteDeltaY = Math.abs(deltaY);

    // King can only move one step but in any direction.
    if (absoluteDeltaX === 1 || absoluteDeltaY === 1) {
      return simulateMove(
        this.copyPosition(),
        target.position,
        stepX,
        stepY,
        1,
      );
    }

    // Check for castling
    if (absoluteDeltaX === 2 && absoluteDeltaY === 0 && !this.hasMoved) {
      let destinationPosition = this.position;
      // Moved two squares horizontally and didn't move before
      if (deltaX === 2) {
        // Kingside castling
        destinationPosition = simulateMove(
          this.copyPosition(),
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
          board: target.position.board,
        };
        destinationPosition = simulateMove(
          this.copyPosition(),
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
  position: Position,
  targetPosition: Position,
  stepX: number,
  stepY: number,
  limit: number,
  allowedToAttackOnLastStep = true,
): Position {
  let limitCounter = 0;
  const startingPosition = position;
  while (
    (position.coordinates[0] !== targetPosition.coordinates[0] ||
      position.coordinates[1] !== targetPosition.coordinates[1]) &&
    limitCounter !== limit
  ) {
    const nextPosition: Position = {
      coordinates: [
        position.coordinates[0] + stepX,
        position.coordinates[1] + stepY,
      ],
      board: position.board,
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

    if (checkIfPositionContainsTrap(nextPosition)) {
      return nextPosition;
    }

    position.coordinates[0] += stepX;
    position.coordinates[1] += stepY;
    limitCounter++;
  }

  return comparePositions(position, targetPosition)
    ? targetPosition
    : startingPosition;
}

function checkIfPositionContainsTrap(position: Position): boolean {
  const item = items.find((item) => comparePositions(position, item.position));
  if (item) {
    switch (item.name) {
      case "trap": {
        return true;
      }
    }
  }

  return false;
}
