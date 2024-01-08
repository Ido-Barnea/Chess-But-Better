import { bishopResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position, Square, simulateMove } from './PiecesHelpers';

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