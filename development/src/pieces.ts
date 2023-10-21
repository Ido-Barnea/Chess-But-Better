import {
  pawnResource,
  bishopResource,
  knightResource,
  rookResource,
  queenResource,
  kingResource,
} from './resources';
import { Player } from './players';
import {
  getCurrentPlayer,
  switchIsCastling,
  getPieceByPositionAndBoard,
  comparePositions,
  items,
  comparePositionsAndBoards,
} from './logic';
import { OVERWORLD_BOARD_ID } from './boards';
import { Item } from './items';

interface PieceType {
  position: [number, number];
  player: Player;
  resource: string;
  name: string;
  hasMoved: boolean;
  board: string;
  hasKilled: boolean;
}

export class Piece implements PieceType {
  position: [number, number];
  player: Player;
  resource: string;
  name: string;
  board: string;
  hasMoved: boolean;
  hasKilled: boolean;

  constructor(
    position: [number, number],
    player: Player,
    resource: string,
    name: string,
  ) {
    this.position = position;
    this.player = player;
    this.resource = resource;
    this.name = name;
    this.board = OVERWORLD_BOARD_ID;
    this.hasMoved = false;
    this.hasKilled = false;
  }

  validateMove(_: Piece | Square | Item): [number, number] {
    return [-1, -1];
  }

  isValidSpawn(_: Piece | Square) {
    return false;
  }

  copyPosition(): [number, number] {
    return Array.from(this.position) as [number, number];
  }
}

export type Square = {
  position: [number, number];
  occupent?: Piece;
  board: string;
};

export class Pawn extends Piece {
  constructor(position: [number, number], player: Player) {
    super(position, player, pawnResource, 'Pawn');
  }

  validateMove(target: Piece | Square) {
    const deltaX = target.position[0] - this.position[0];
    const deltaY = target.position[1] - this.position[1];

    const absoluteDeltaX = Math.abs(deltaX);
    const absoluteDeltaY = Math.abs(deltaY);

    const stepY =
      target.position[1] > this.position[1]
        ? 1
        : target.position[1] < this.position[1]
          ? -1
          : 0;

    // Make sure pawn does not move backwards.
    const currentPlayer = getCurrentPlayer();
    if (
      (currentPlayer.color === 'white' && deltaY > 0) ||
      (currentPlayer.color === 'black' && deltaY < 0)
    ) {
      return this.position;
    }

    // Pawns attack diagonally.
    if ((target as Piece).name !== undefined) {
      return absoluteDeltaY === 1 && absoluteDeltaX === 1 ? target.position : this.position;
    }

    // Pawns can have an initial two-square move.
    if (!this.hasMoved && absoluteDeltaY === 2 && absoluteDeltaX === 0) {
      return validateMove(
        this.board,
        this.copyPosition(),
        target.position,
        0,
        stepY,
        2,
      );
    }

    // Pawns move one square forward.
    return absoluteDeltaY === 1 && absoluteDeltaX === 0 ? target.position : this.position;
  }
}

export class Bishop extends Piece {
  constructor(position: [number, number], player: Player) {
    super(position, player, bishopResource, 'Bishop');
  }

  validateMove(target: Piece | Square) {
    const stepX = target.position[0] > this.position[0] ? 1 : -1;
    const stepY = target.position[1] > this.position[1] ? 1 : -1;

    const absoluteDeltaX = Math.abs(target.position[0] - this.position[0]);
    const absoluteDeltaY = Math.abs(target.position[1] - this.position[1]);

    // Bishops can only move diagonally.
    if (absoluteDeltaY === absoluteDeltaX) {
      return validateMove(
        this.board,
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
  constructor(position: [number, number], player: Player) {
    super(position, player, knightResource, 'Knight');
  }

  validateMove(target: Piece | Square) {
    const absoluteDeltaX = Math.abs(target.position[0] - this.position[0]);
    const absoluteDeltaY = Math.abs(target.position[1] - this.position[1]);

    // Knights can move two squares in any direction and one square to the side.
    return absoluteDeltaY * absoluteDeltaX === 2 ? target.position : this.position;
  }
}

export class Rook extends Piece {
  constructor(position: [number, number], player: Player) {
    super(position, player, rookResource, 'Rook');
  }

  validateMove(target: Piece | Square) {
    const stepX =
      target.position[0] > this.position[0]
        ? 1
        : target.position[0] < this.position[0]
          ? -1
          : 0;
    const stepY =
      target.position[1] > this.position[1]
        ? 1
        : target.position[1] < this.position[1]
          ? -1
          : 0;

    // Rooks can move either vertically or horizontally but not both at the same.
    if (
      this.position[1] === target.position[1] ||
      this.position[0] === target.position[0]
    ) {
      return validateMove(
        this.board,
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
  constructor(position: [number, number], player: Player) {
    super(position, player, queenResource, 'Queen');
  }

  validateMove(target: Piece | Square) {
    const stepX =
      target.position[0] > this.position[0]
        ? 1
        : target.position[0] < this.position[0]
          ? -1
          : 0;
    const stepY =
      target.position[1] > this.position[1]
        ? 1
        : target.position[1] < this.position[1]
          ? -1
          : 0;

    const absoluteDeltaX = Math.abs(target.position[0] - this.position[0]);
    const absoluteDeltaY = Math.abs(target.position[1] - this.position[1]);

    // Queens can move vertically, horizontally or diagonally.
    if (
      this.position[1] === target.position[1] ||
      this.position[0] === target.position[0] ||
      absoluteDeltaY === absoluteDeltaX
    ) {
      return validateMove(
        this.board,
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
  constructor(position: [number, number], player: Player) {
    super(position, player, kingResource, 'King');
  }

  validateMove(target: Piece | Square) {
    const stepX =
      target.position[0] > this.position[0]
        ? 1
        : target.position[0] < this.position[0]
          ? -1
          : 0;
    const stepY =
      target.position[1] > this.position[1]
        ? 1
        : target.position[1] < this.position[1]
          ? -1
          : 0;

    const deltaX = target.position[0] - this.position[0];
    const deltaY = target.position[1] - this.position[1];

    const absoluteDeltaX = Math.abs(deltaX);
    const absoluteDeltaY = Math.abs(deltaY);

    // King can only move one step but in any direction.
    if (absoluteDeltaX === 1 || absoluteDeltaY === 1) {
      return validateMove(
        this.board,
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
        destinationPosition = validateMove(
          this.board,
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
        const targetPosition: [number, number] = [
          target.position[0] - 1,
          target.position[1],
        ];
        destinationPosition = validateMove(
          this.board,
          this.copyPosition(),
          targetPosition,
          stepX,
          stepY,
          3,
          false,
        );
      }

      if (!comparePositions(destinationPosition, this.position)) switchIsCastling();
      return destinationPosition;
    }

    return this.position;
  }
}

function validateMove(
  board: string,
  position: [number, number],
  targetPosition: [number, number],
  stepX: number,
  stepY: number,
  limit: number,
  allowedToAttackOnLastStep = true,
): [number, number] {
  let limitCounter = 0;
  const startingPosition: [number, number] = [position[0], position[1]];
  while (
    (position[0] !== targetPosition[0] || position[1] !== targetPosition[1]) &&
    limitCounter !== limit
  ) {
    const nextPosition: [number, number] = [
      position[0] + stepX,
      position[1] + stepY,
    ];

    // Check if any square along the piece's path is occupied (not including the destination square)
    const targetPiece = getPieceByPositionAndBoard(nextPosition, board);
    if (
      targetPiece &&
      (!comparePositions(nextPosition, targetPosition) ||
        !allowedToAttackOnLastStep)
    ) {
      return startingPosition;
    }

    if (checkIfPositionContainsTrap(nextPosition, board)) {
      return nextPosition;
    }

    position[0] += stepX;
    position[1] += stepY;
    limitCounter++;
  }

  return comparePositions(position, targetPosition) ? targetPosition : startingPosition;
}

function checkIfPositionContainsTrap(position: [number, number], board: string): boolean {
  const item = items.find((item) => comparePositionsAndBoards(position, item.position!, board, item.board!));
  if (item) {
    switch (item.name) {
      case ('trap'): {
        return true;
      }
    }
  }

  return false;
}
