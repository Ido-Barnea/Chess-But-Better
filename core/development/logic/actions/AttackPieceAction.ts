import { game } from '../../Game';
import { move } from '../PieceLogic';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { Position } from '../pieces/types/Position';
import { Square } from '../pieces/types/Square';
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
    const targetPosition = this.target.copyPosition() as Position;

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
