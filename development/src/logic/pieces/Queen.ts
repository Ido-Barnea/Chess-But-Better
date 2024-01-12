import { queenResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position, Square, simulateMove } from './PiecesHelpers';

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