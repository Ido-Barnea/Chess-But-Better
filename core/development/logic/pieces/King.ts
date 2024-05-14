import { kingResource } from '../../ui/Resources';
import { Player } from '../players/Player';
import { getPieceByPosition } from '../Utilities';
import { Rook } from './Rook';
import { game } from '../../Game';
import { PlayerColor } from '../players/types/PlayerColor';
import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { PieceResource } from '../../../model/pieces/PieceResource';
import { PieceStats } from '../../../model/pieces/PieceStats';
import { PieceModifiers } from '../../../model/pieces/PieceModifiers';

export class King extends BasePiece {
  constructor(player: Player, position?: Position) {
    const icon = player.color === PlayerColor.WHITE ? '♔' : '♚';
    super(
      new PieceResource(kingResource, icon, 'King'),
      new PieceStats(1, 1, 1),
      new PieceModifiers(),
      player,
      position
    );
  }

  getRookForCastling(player: Player, kingside: boolean): Rook | undefined {
    const rank = player.color === PlayerColor.WHITE ? 7 : 0;
    if (!this.position) return;

    if (kingside) {
      // Kingside castling
      const kingsideCastlingRookXCoordinate = 7;
      const kingsideRookPosition: Position = {
        coordinates: [kingsideCastlingRookXCoordinate, rank],
        boardId: this.position.boardId,
      };

      return getPieceByPosition(kingsideRookPosition) as Rook | undefined;
    } else {
      // Queenside castling
      const queensideCastlingRookXCoordinate = 0;
      const queensideRookPosition: Position = {
        coordinates: [queensideCastlingRookXCoordinate, rank],
        boardId: this.position.boardId,
      };

      return getPieceByPosition(queensideRookPosition) as Rook | undefined;
    }
  }

  isPathClear(start: Position, end: Position): boolean {
    const deltaX = Math.sign(end.coordinates[0] - start.coordinates[0]);
    const deltaY = Math.sign(end.coordinates[1] - start.coordinates[1]);
    if (!this.position) return false;
    let currentX = start.coordinates[0] + deltaX;
    let currentY = start.coordinates[1] + deltaY;

    while (currentX !== end.coordinates[0] || currentY !== end.coordinates[1]) {
      if (
        getPieceByPosition({
          coordinates: [currentX, currentY],
          boardId: this.position.boardId,
        })
      ) {
        return false;
      }

      currentX += deltaX;
      currentY += deltaY;
    }

    if (
      getPieceByPosition({
        coordinates: [currentX, currentY],
        boardId: this.position.boardId,
      })
    ) {
      return false;
    }

    return true;
  }

  getLegalMoves(): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    // Define possible directions for the king to move
    const directions = [
      { deltaX: 1, deltaY: 0 },
      { deltaX: 1, deltaY: 1 },
      { deltaX: 0, deltaY: 1 },
      { deltaX: -1, deltaY: 1 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: -1, deltaY: -1 },
      { deltaX: 0, deltaY: -1 },
      { deltaX: 1, deltaY: -1 },
    ];

    for (const direction of directions) {
      const nextX = currentCoordinates[0] + direction.deltaX;
      const nextY = currentCoordinates[1] + direction.deltaY;

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

    // Check for castling
    if (!this.modifiers.hasMoved) {
      const kingsideRook = this.getRookForCastling(this.player, true);
      const queensideRook = this.getRookForCastling(this.player, false);

      // Kingside castling
      if (kingsideRook && !kingsideRook.modifiers.hasMoved) {
        const kingsideTargetPosition: Position = {
          coordinates: [currentCoordinates[0] + 2, currentCoordinates[1]],
          boardId: this.position.boardId,
        };
        if (this.isPathClear(this.position, kingsideTargetPosition)) {
          game.switchIsCastling();
          validMoves.push(kingsideTargetPosition);
        }
      }

      // Queenside castling
      if (queensideRook && !queensideRook.modifiers.hasMoved) {
        const queensideTargetPosition: Position = {
          coordinates: [currentCoordinates[0] - 2, currentCoordinates[1]],
          boardId: this.position.boardId,
        };
        if (this.isPathClear(this.position, queensideTargetPosition)) {
          game.switchIsCastling();
          validMoves.push(queensideTargetPosition);
        }
      }
    }

    return validMoves;
  }
}
