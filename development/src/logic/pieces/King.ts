import { kingResource } from '../../ui/Resources';
import { comparePositions, switchIsCastling } from '../Logic';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position, Square, simulateMove } from './PiecesHelpers';

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