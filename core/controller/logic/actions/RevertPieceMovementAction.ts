import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { movePieceOnBoard } from '../../LogicAdapter';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class RevertPieceMovementAction implements GameAction {
  private piece: BasePiece;

  constructor(piece: BasePiece) {
    this.piece = piece;
  }
  execute(): ActionResult {
    if (!this.piece.position) return ActionResult.FAILURE;

    movePieceOnBoard(this.piece, this.piece.position);

    return ActionResult.SUCCESS;
  }
}
