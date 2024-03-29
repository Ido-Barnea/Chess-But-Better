import { golemResource } from '../../ui/Resources';
import { Player } from '../players/Player';
import { getPieceByPosition } from '../Utilities';
import { BasePiece } from './abstract/BasePiece';
import { Position } from './types/Position';

export class Golem extends BasePiece {
  constructor(player: Player, position?: Position) {
    super(golemResource, '🗿', 'Golem', player, position);

    this.health = 3;
    this.price = 4;
  }

  getLegalMoves(): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position?.coordinates;

    // Iterate over possible horizontal and vertical directions
    const directions = [
      { deltaX: 1, deltaY: 0 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: 0, deltaY: 1 },
      { deltaX: 0, deltaY: -1 },
    ];

    for (const direction of directions) {
      let stepX = direction.deltaX;
      let stepY = direction.deltaY;

      const MAX_MOVEMENT_DISTANCE = 2;
      let movementDistance = 0;

      // Iterate until the edge of the board
      while (movementDistance < MAX_MOVEMENT_DISTANCE) {
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
        movementDistance++;
      }
    }

    return validMoves;
  }
}
