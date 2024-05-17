import { pawnResource } from '../../ui/Resources';
import { Player } from '../players/Player';
import { game } from '../../Game';
import { comparePositions, getPieceByPosition } from '../Utilities';
import { PlayerColor } from '../players/types/PlayerColor';
import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { PieceResource } from '../../../model/pieces/PieceResource';
import { PieceStats } from '../../../model/pieces/PieceStats';
import { PieceModifiers } from '../../../model/pieces/PieceModifiers';

export class Pawn extends BasePiece {
  possibleEnPassantPositions: [Position, Position] | undefined;
  isInitialDoubleStep: boolean;
  diagonalAttackPosition: Position | undefined;

  constructor(player: Player, position?: Position) {
    const icon = player.color === PlayerColor.WHITE ? '♙' : '♟';
    super(
      new PieceResource(pawnResource, icon, 'Pawn'),
      new PieceStats(1, 1, 1),
      new PieceModifiers(),
      player,
      position,
    );

    this.possibleEnPassantPositions = undefined;
    this.isInitialDoubleStep = false;
    this.diagonalAttackPosition = undefined;
  }

  getEnPassantPiece(targetPosition: Position): BasePiece | undefined {
    const pawns = game.getPieces().filter((piece) => {
      return piece instanceof Pawn && piece !== this;
    }) as Array<Pawn>;
    if (!pawns.length) return;

    const enPassantPawns = pawns.filter((pawn) => {
      if (pawn.isInitialDoubleStep && pawn.possibleEnPassantPositions) {
        return comparePositions(
          pawn.possibleEnPassantPositions[0],
          targetPosition,
        );
      }
    });
    if (!enPassantPawns.length) return;

    return enPassantPawns[0];
  }

  getLegalMoves(): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;
    const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();

    // Determine the direction of pawn movement based on the player's color
    const stepY = currentPlayer.color === PlayerColor.WHITE ? -1 : 1;

    // Check one square forward
    const oneSquareForward: Position = {
      coordinates: [currentCoordinates[0], currentCoordinates[1] + stepY],
      boardId: this.position.boardId,
    };

    if (!getPieceByPosition(oneSquareForward)) {
      validMoves.push(oneSquareForward);

      // Check two squares forward for the initial move
      if (!this.modifiers.hasMoved) {
        const twoSquaresForward: Position = {
          coordinates: [
            currentCoordinates[0],
            currentCoordinates[1] + 2 * stepY,
          ],
          boardId: this.position.boardId,
        };

        if (
          !getPieceByPosition(twoSquaresForward) &&
          !getPieceByPosition(oneSquareForward)
        ) {
          this.possibleEnPassantPositions = [
            oneSquareForward,
            twoSquaresForward,
          ];
          validMoves.push(twoSquaresForward);
        }
      }
    }

    // Check diagonal attacks
    const leftDiagonal: Position = {
      coordinates: [currentCoordinates[0] - 1, currentCoordinates[1] + stepY],
      boardId: this.position.boardId,
    };

    const rightDiagonal: Position = {
      coordinates: [currentCoordinates[0] + 1, currentCoordinates[1] + stepY],
      boardId: this.position.boardId,
    };

    if (
      getPieceByPosition(leftDiagonal) ||
      this.getEnPassantPiece(leftDiagonal)
    ) {
      this.diagonalAttackPosition = leftDiagonal;
      validMoves.push(leftDiagonal);
    }

    if (
      getPieceByPosition(rightDiagonal) ||
      this.getEnPassantPiece(rightDiagonal)
    ) {
      this.diagonalAttackPosition = rightDiagonal;
      validMoves.push(rightDiagonal);
    }

    return validMoves;
  }
}
