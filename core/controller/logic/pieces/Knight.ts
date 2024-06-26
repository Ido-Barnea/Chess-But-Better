import { knightResource } from '../../ui/Resources';
import { Player } from '../players/Player';
import { Unicorn } from './Unicorn';
import { PlayerColor } from '../players/types/PlayerColor';
import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { PieceResource } from '../../../model/pieces/PieceResource';
import { PieceStats } from '../../../model/pieces/PieceStats';
import { PieceModifiers } from '../../../model/pieces/PieceModifiers';

export class Knight extends BasePiece {
  constructor(player: Player, position?: Position) {
    const icon = player.color === PlayerColor.WHITE ? '♘' : '♞';
    super(
      new PieceResource(knightResource, icon, 'Knight'),
      new PieceStats(1, 1, 1),
      new PieceModifiers([Unicorn]),
      player,
      position,
    );
  }

  getLegalMoves(): Array<Position> {
    if (!this.position) return [];

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
