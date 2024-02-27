import { knightResource } from '../../ui/Resources';
import { Piece } from './Piece';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Unicorn } from './Unicorn';

export class Knight extends Piece {
  constructor(player: Player, position: Position) {
    const icon = player.color === PlayerColors.WHITE ? '♘' : '♞';
    super(knightResource, icon, 'Knight', player, position);

    this.upgrades = [Unicorn];
  }

  getLegalMoves(): Array<Position> {
    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    // Define all possible knight move offsets
    const knightMoveOffsets = [
      { deltaX: 2, deltaY: 1 },
      { deltaX: 2, deltaY: -1 },
      { deltaX: -2, deltaY: 1 },
      { deltaX: -2, deltaY: -1 },
      { deltaX: 1, deltaY: 2 },
      { deltaX: 1, deltaY: -2 },
      { deltaX: -1, deltaY: 2 },
      { deltaX: -1, deltaY: -2 },
    ];

    for (const offset of knightMoveOffsets) {
      const nextX = currentCoordinates[0] + offset.deltaX;
      const nextY = currentCoordinates[1] + offset.deltaY;

      // Check if the next position is within the board boundaries
      if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8) {
        const nextPosition: Position = {
          coordinates: [nextX, nextY],
          boardId: this.position.boardId,
        };

        // Add the position to the list of valid moves
        validMoves.push(nextPosition);
      }
    }

    return validMoves;
  }
}
