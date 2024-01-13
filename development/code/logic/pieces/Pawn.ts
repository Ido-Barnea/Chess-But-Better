import { pawnResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { game } from '../../Game';
import { comparePositions, getPieceByPosition } from '../Utilities';

export class Pawn extends Piece {
  enPassantPositions: [Position, Position] | undefined;
  isDiagonalAttack: boolean;

  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♙'
      : '♟';
    super(position, player, pawnResource, 'Pawn', logo);
    this.enPassantPositions = undefined;
    this.isDiagonalAttack = false;
  }

  isValidEnPassant(targetPosition: Position) {
    const pawns = game.getPieces().filter(piece => piece instanceof Pawn && piece !== this) as Array<Pawn>;
    if (!pawns) return;

    const enPassantPawns = pawns.filter(pawn => {
      if (pawn.enPassantPositions) {
        return comparePositions(pawn.enPassantPositions[0], targetPosition);
      }
    });
    if (!enPassantPawns.length) return;

    return enPassantPawns[0];
  }

  getValidMoves(): Array<Position> {
    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;
    const currentPlayer = game.getCurrentPlayer();

    // Determine the direction of pawn movement based on the player's color
    const stepY = currentPlayer.color === PlayerColors.WHITE ? -1 : 1;

    // Check one square forward
    const oneSquareForward: Position = {
      coordinates: [currentCoordinates[0], currentCoordinates[1] + stepY],
      boardId: this.position.boardId,
    };

    if (!getPieceByPosition(oneSquareForward)) {
      validMoves.push(oneSquareForward);

      // Check two squares forward for the initial move
      if (!this.hasMoved) {
        const twoSquaresForward: Position = {
          coordinates: [currentCoordinates[0], currentCoordinates[1] + 2 * stepY],
          boardId: this.position.boardId,
        };

        if (!getPieceByPosition(twoSquaresForward) && !getPieceByPosition(oneSquareForward)) {
          this.enPassantPositions = [oneSquareForward, twoSquaresForward];
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

    if (getPieceByPosition(leftDiagonal) || this.isValidEnPassant(leftDiagonal)) {
      this.isDiagonalAttack = true;
      validMoves.push(leftDiagonal);
    }

    if (getPieceByPosition(rightDiagonal) || this.isValidEnPassant(rightDiagonal)) {
      this.isDiagonalAttack = true;
      validMoves.push(rightDiagonal);
    }

    return validMoves;
  }
}