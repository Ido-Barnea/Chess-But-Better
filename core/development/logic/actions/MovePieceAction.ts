import { game } from '../../Game';
import { move } from '../PieceLogic';
import { comparePositions } from '../Utilities';
import { King } from '../pieces/King';
import { Pawn } from '../pieces/Pawn';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { Position } from '../pieces/types/Position';
import { CastleAction } from './CastleAction';
import { KillPieceByPieceAction } from './KillPieceByPieceAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class MovePieceAction implements GameAction {
  protected piece: BasePiece;
  protected targetPosition: Position;

  constructor(piece: BasePiece, target: Position) {
    this.piece = piece;
    this.targetPosition = target;
  }

  execute(): ActionResult {
    if (this.piece instanceof Pawn) {
      this.piece.checkInitialDoubleStep(this.targetPosition);

      if (this.piece.diagonalAttackPosition) {
        if (
          comparePositions(
            this.piece.diagonalAttackPosition,
            this.targetPosition,
          )
        ) {
          const enPassantPiece = this.piece.getEnPassantPiece(
            this.targetPosition,
          );
          if (!enPassantPiece) return ActionResult.FAILURE;

          const enPassantAttackResult = new KillPieceByPieceAction(
            enPassantPiece,
            this.piece,
          ).execute();
          if (enPassantAttackResult == ActionResult.FAILURE)
            return ActionResult.FAILURE;
        }
      }
    }

    if (game.getIsCaslting()) {
      const castlingActionResult = new CastleAction(
        this.piece as King,
        this.targetPosition,
      ).execute();

      if (castlingActionResult == ActionResult.FAILURE) {
        game.switchIsCastling();
        return ActionResult.FAILURE;
      }
    }

    move(this.piece, this.targetPosition);
    return ActionResult.SUCCESS;
  }
}
