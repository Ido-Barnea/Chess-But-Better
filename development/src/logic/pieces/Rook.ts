import { rookResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position, Square, simulateMove } from './PiecesUtilities';

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