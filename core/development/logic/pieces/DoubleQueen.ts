import { doubleQueenResource } from '../../ui/Resources';
import { Piece } from './Piece';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { getPieceByPosition } from '../Utilities';

export class DoubleQueen extends Piece {
  constructor(player: Player, position: Position) {
    const icon = player.color === PlayerColors.WHITE ? '♕x2' : '♛x2';
    super(doubleQueenResource, icon, 'Double Queen', player, position);

    this.moves = 2;
    this.price = 8;
  }

  getLegalMoves(): Array<Position> {
    const validMoves: Array<Position> = [];
    if (!this.position) return validMoves;
    const currentCoordinates = this.position.coordinates;

    // Iterate over all possible directions for the queen
    const directions = [
      { deltaX: 1, deltaY: 0 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: 0, deltaY: 1 },
      { deltaX: 0, deltaY: -1 },
      { deltaX: 1, deltaY: 1 },
      { deltaX: -1, deltaY: -1 },
      { deltaX: 1, deltaY: -1 },
      { deltaX: -1, deltaY: 1 },
    ];

    for (const direction of directions) {
      let stepX = direction.deltaX;
      let stepY = direction.deltaY;

      // Iterate until the edge of the board
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
