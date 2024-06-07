import { doubleQueenResource } from '../../view/resources/Resources';
import { Player } from '../game state/storages/players storage/Player';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Position } from '../../model/types/Position';
import { PieceResource } from '../../model/pieces/PieceResource';
import { PieceStats } from '../../model/pieces/PieceStats';
import { PieceModifiers } from '../../model/pieces/PieceModifiers';
import { IPiecesStorage } from '../game state/storages/pieces storage/abstract/IPiecesStorage';
import { isEqual } from 'lodash';

export class DoubleQueen extends BasePiece {
  constructor(player: Player, position?: Position) {
    const icon = player.color === PlayerColor.WHITE ? '♕x2' : '♛x2';
    super(
      new PieceResource(doubleQueenResource, icon, 'Double Queen'),
      new PieceStats(2, 1, 8),
      new PieceModifiers(),
      player,
      position,
    );
  }

  getLegalMoves(piecesStorage: IPiecesStorage): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
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
        const nextX = currentCoordinates.x + stepX;
        const nextY = currentCoordinates.y + stepY;

        // Check if the next position is within the board boundaries
        if (nextX < 0 || nextX >= 8 || nextY < 0 || nextY >= 8) {
          break;
        }

        const nextPosition: Position = {
          coordinates: {
            x: nextX,
            y: nextY,
          },
          boardId: this.position.boardId,
        };

        // Add the position to the list of valid moves
        validMoves.push(nextPosition);

        // If the move encounters another piece, stop iterating in this direction
        if (piecesStorage.getPieces((piece) => isEqual(piece.position, nextPosition))) {
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
