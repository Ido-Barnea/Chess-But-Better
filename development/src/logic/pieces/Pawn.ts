import { pawnResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position, Square, simulateMove } from './PiecesHelpers';
import { Game } from '../Game';

export class Pawn extends Piece {
  enPassant: boolean;
  enPassantPosition: Position | undefined;

  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♙'
      : '♟';
    super(position, player, pawnResource, 'Pawn', logo);
    this.enPassant = false;
    this.enPassantPosition = undefined;
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
    const currentPlayer = Game.getCurrentPlayer();
    if (
      (currentPlayer.color === PlayerColors.WHITE && deltaY > 0) ||
      (currentPlayer.color === PlayerColors.BLACK && deltaY < 0)
    ) {
      return this.position;
    }
    
    // Pawns can attack diagonally.
    const isDiagonalMovement = absDeltaY === 1 && absDeltaX === 1;
    const enPassantPosition = this.enPassantPosition;
    this.enPassant = !!enPassantPosition && isDiagonalMovement &&
     (targetCoordinates[0] === enPassantPosition.coordinates[0]) &&
     Math.abs(targetCoordinates[1] - enPassantPosition.coordinates[1]) === 1;

    if (this.enPassant || target instanceof Piece) {
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
        this.enPassantPosition = validatedMove;
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