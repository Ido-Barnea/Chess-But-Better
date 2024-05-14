import { bishopResource } from '../../ui/Resources';
import { Player } from '../players/Player';
import { getPieceByPosition } from '../Utilities';
import { PlayerColor } from '../players/types/PlayerColor';
import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { PieceResource } from '../../../model/pieces/PieceResource';
import { PieceStats } from '../../../model/pieces/PieceStats';
import { PieceModifiers } from '../../../model/pieces/PieceModifiers';

export class Bishop extends BasePiece {
  constructor(player: Player, position?: Position) {
    const icon = player.color === PlayerColor.WHITE ? '♗' : '♝';
    super(
      new PieceResource(bishopResource, icon, 'Bishop'),
      new PieceStats(1, 1, 1),
      new PieceModifiers(),
      player,
      position,
    );
  }

  getLegalMoves(): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    // Iterate over all possible directions (diagonals) for the bishop
    const directions = [
      { deltaX: 1, deltaY: 1 },
      { deltaX: 1, deltaY: -1 },
      { deltaX: -1, deltaY: 1 },
      { deltaX: -1, deltaY: -1 },
    ];

    for (const direction of directions) {
      let stepX = direction.deltaX;
      let stepY = direction.deltaY;

      // Iterate until the edge of the board or another piece is encountered
      while (true) {
        const nextX = currentCoordinates[0] + stepX;
        const nextY = currentCoordinates[1] + stepY;

        // Check if the next position is within the board boundaries
        if (nextX < 0 || nextX >= 8 || nextY < 0 || nextY >= 8) {
          break;
        }

        const nextPosition: Position = {
          coordinates: [nextX, nextY],
          boardId: this.position.boardId,
        };

        // Add the position to the list of valid moves
        validMoves.push(nextPosition);

        // If the move encounters another piece, stop iterating in this direction
        if (getPieceByPosition(nextPosition)) {
          break;
        }

        // Move further in the current direction
        stepX += direction.deltaX;
        stepY += direction.deltaY;
      }
    }

    return validMoves;
  }
}
