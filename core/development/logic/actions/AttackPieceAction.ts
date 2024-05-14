import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { Square } from '../../../model/types/Square';
import { game } from '../../Game';
import { move } from '../PieceLogic';
import { KillPieceByPieceAction } from './KillPieceByPieceAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class AttackPieceAction implements GameAction {
  private piece: BasePiece;
  private target: BasePiece;

  constructor(piece: BasePiece, target: BasePiece) {
    this.piece = piece;
    this.target = target;
  }

  execute(): ActionResult {
    if (!this.target.position) return ActionResult.FAILURE;
    const targetPosition: Position = {
      coordinates: this.target.position.coordinates,
      boardId: this.target.position.boardId,
    }

    game.setIsFriendlyFire(this.target.player === this.piece.player);
    const killPieceByPieceResult = new KillPieceByPieceAction(
      this.target,
      this.piece,
    ).execute();

    if (killPieceByPieceResult === ActionResult.FAILURE) {
      return ActionResult.FAILURE;
    }

    const targetSquare: Square = { position: targetPosition };
    move(this.piece, targetSquare.position);
    return ActionResult.SUCCESS;
  }
}
