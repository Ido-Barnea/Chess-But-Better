import { PieceModifiers } from '../../../model/pieces/PieceModifiers';
import { PieceResource } from '../../../model/pieces/PieceResource';
import { PieceStats } from '../../../model/pieces/PieceStats';
import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { unicornResource } from '../../ui/Resources';
import { getPieceByPosition } from '../Utilities';
import { Player } from '../players/Player';

export class Unicorn extends BasePiece {
  constructor(player: Player, position?: Position) {
    super(
      new PieceResource(unicornResource, '🦄', 'Unicorn'),
      new PieceStats(1, 1, 4),
      new PieceModifiers(),
      player,
      position
    );
  }

  getAttackablePieces(): Array<BasePiece> {
    if (!this.position) return [];

    const currentCoordinates = this.position.coordinates;
    const attackablePieces = [];

    const attackablePositionsOffsets = [
      { deltaX: 1, deltaY: 0 },
      { deltaX: 0, deltaY: 1 },
      { deltaX: 1, deltaY: 1 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: 0, deltaY: -1 },
      { deltaX: -1, deltaY: -1 },
      { deltaX: -1, deltaY: 1 },
      { deltaX: 1, deltaY: -1 },
    ];

    for (const offset of attackablePositionsOffsets) {
      const nextX = currentCoordinates[0] + offset.deltaX;
      const nextY = currentCoordinates[1] + offset.deltaY;

      const targetPosition: Position = {
        coordinates: [nextX, nextY],
        boardId: this.position.boardId,
      };

      const targetPiece = getPieceByPosition(targetPosition);
      if (targetPiece) {
        attackablePieces.push(targetPiece);
      }
    }

    return attackablePieces;
  }

  getLegalMoves(): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    const unicornMoveOffsets = [
      { deltaX: 2, deltaY: 1 },
      { deltaX: 2, deltaY: -1 },
      { deltaX: -2, deltaY: 1 },
      { deltaX: -2, deltaY: -1 },
      { deltaX: 1, deltaY: 2 },
      { deltaX: 1, deltaY: -2 },
      { deltaX: -1, deltaY: 2 },
      { deltaX: -1, deltaY: -2 },
    ];

    for (const offset of unicornMoveOffsets) {
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
