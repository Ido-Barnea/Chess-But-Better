import { unicornResource } from '../../view/resources/Resources';
import { PieceModifiers } from '../../model/pieces/PieceModifiers';
import { PieceResource } from '../../model/pieces/PieceResource';
import { PieceStats } from '../../model/pieces/PieceStats';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Position } from '../../model/types/Position';
import { Player } from '../game state/storages/players storage/Player';
import { IPiecesStorage } from '../game state/storages/pieces storage/abstract/IPiecesStorage';
import { isEqual } from 'lodash';

export class Unicorn extends BasePiece {
  constructor(player: Player, position?: Position) {
    super(
      new PieceResource(unicornResource, '🦄', 'Unicorn'),
      new PieceStats(1, 1, 4),
      new PieceModifiers(),
      player,
      position,
    );
  }

  getAttackablePieces(piecesStorage: IPiecesStorage): Array<BasePiece> {
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
      const nextX = currentCoordinates.x + offset.deltaX;
      const nextY = currentCoordinates.y + offset.deltaY;

      const targetPosition: Position = {
        coordinates: {
          x: nextX,
          y: nextY,
        },
        boardId: this.position.boardId,
      };

      const targetPiece = piecesStorage.getPieces((piece) => isEqual(piece.position, targetPosition));
      if (targetPiece) {
        attackablePieces.push(targetPiece[0]);
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
      const nextX = currentCoordinates.x + offset.deltaX;
      const nextY = currentCoordinates.y + offset.deltaY;

      // Check if the next position is within the board boundaries
      if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8) {
        const nextPosition: Position = {
          coordinates: {
            x: nextX,
            y: nextY,
          },
          boardId: this.position.boardId,
        };

        // Add the position to the list of valid moves
        validMoves.push(nextPosition);
      }
    }

    return validMoves;
  }
}
