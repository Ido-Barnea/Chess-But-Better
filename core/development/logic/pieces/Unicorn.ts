import { unicornResource } from '../../ui/Resources';
import { BasePiece } from './abstract/BasePiece';
import { getPieceByPosition } from '../Utilities';
import { Position } from './types/Position';
import { Player } from '../players/Player';
import { Piece } from './abstract/Piece';

export class Unicorn extends BasePiece {
  constructor(player: Player, position?: Position) {
    super(unicornResource, '🦄', 'Unicorn', player, position);

    this.price = 4;
  }

  getAttackablePieces(): Array<Piece> {
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
