import { Position } from '../../../model/types/Position';
import { Square } from '../../../model/types/Square';
import { Log } from '../../ui/logs/Log';
import { move } from '../PieceLogic';
import { King } from '../pieces/King';
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

    const targetXPosition = this.targetPosition.coordinates.x;
    const kingXPosition = this.piece.position.coordinates.x;
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
      coordinates: {
        x: isKingsideCastling
          ? this.targetPosition.coordinates.x - 1
          : this.targetPosition.coordinates.x + 1,
        y: this.piece.position.coordinates.y,
      },
      boardId: rookPiece.position.boardId,
    };

    const rookPieceTargetSquare: Square = { position: rookPieceTargetPosition };
    move(rookPiece, rookPieceTargetSquare.position, false);

    new Log(
      `${this.piece.resource.pieceIcon} ${this.piece.player.color} castled.`,
    ).addToQueue();
    return ActionResult.SUCCESS;
  }
}
