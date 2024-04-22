import { Log } from '../../ui/logs/Log';
import { move } from '../PieceLogic';
import { King } from '../pieces/King';
import { Position } from '../pieces/types/Position';
import { Square } from '../pieces/types/Square';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class CastleAction implements GameAction {
  private piece: King;
  private targetPosition: Position;

  constructor(piece: King, targetPosition: Position) {
    this.piece = piece;
    this.targetPosition = targetPosition;
  }

  execute(): ActionResult {
    if (!this.piece.position) return ActionResult.FAILURE;

    const targetXPosition = this.targetPosition.coordinates[0];
    const kingXPosition = this.piece.position.coordinates[0];
    const deltaX = targetXPosition - kingXPosition;
    const isKingsideCastling = deltaX > 0;

    const isValidCastling = Math.abs(deltaX) == 2;
    if (!isValidCastling) return ActionResult.FAILURE;

    const rookPiece = this.piece.getRookForCastling(
      this.piece.player,
      isKingsideCastling,
    );
    if (!rookPiece || !rookPiece.position) return ActionResult.FAILURE;

    const rookPieceTargetPosition: Position = {
      coordinates: [
        isKingsideCastling
          ? this.targetPosition.coordinates[0] - 1
          : this.targetPosition.coordinates[0] + 1,
        this.piece.position.coordinates[1],
      ],
      boardId: rookPiece.position.boardId,
    };

    const rookPieceTargetSquare: Square = { position: rookPieceTargetPosition };
    move(rookPiece, rookPieceTargetSquare.position, false);

    new Log(
      `${this.piece.pieceIcon} ${this.piece.player.color} castled.`,
    ).addToQueue();
    return ActionResult.SUCCESS;
  }
}
