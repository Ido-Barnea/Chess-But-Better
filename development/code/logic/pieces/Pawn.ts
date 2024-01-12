import { pawnResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { game } from '../../Game';
import { getPieceByPosition } from '../Utilities';

export class Pawn extends Piece {
  enPassant: boolean;
  enPassantPosition: Position | undefined;

  constructor(position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♙'
      : '♟';
    super(position, player, pawnResource, 'Pawn', logo);
    this.enPassant = false;
    this.enPassantPosition = undefined;
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

    if (getPieceByPosition(leftDiagonal)) {
      validMoves.push(leftDiagonal);
    }

    if (getPieceByPosition(rightDiagonal)) {
      validMoves.push(rightDiagonal);
    }

    // Check for en passant
    if (this.enPassantPosition) {
      if (!getPieceByPosition(this.enPassantPosition)) {
        validMoves.push(this.enPassantPosition);
      }
    }

    return validMoves;
  }
}