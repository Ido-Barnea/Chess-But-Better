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
    const isPiecePawn = this.piece instanceof Pawn;
    if (isPiecePawn) {
      const pieceAsPawn = this.piece as Pawn;

      const isPawnDiagonalAttack = pieceAsPawn.diagonalAttackPosition;
      const isSuspectedEnPassant = comparePositions(
        pieceAsPawn.diagonalAttackPosition,
        this.targetPosition,
      );
      if (isPawnDiagonalAttack && isSuspectedEnPassant) {
        const enPassantPiece = pieceAsPawn.getEnPassantPiece(
          this.targetPosition,
        );
        if (!enPassantPiece) return ActionResult.FAILURE;

        const enPassantAttackResult = new KillPieceByPieceAction(
          enPassantPiece,
          this.piece,
        ).execute();

        if (enPassantAttackResult == ActionResult.FAILURE) {
          return ActionResult.FAILURE;
        }
      }
    }

    if (game.getIsCaslting()) {
      const castlingActionResult = new CastleAction(
        this.piece as King,
        this.targetPosition,
      ).execute();

      if (castlingActionResult === ActionResult.FAILURE) {
        game.switchIsCastling();
        return ActionResult.FAILURE;
      }
    }

    move(this.piece, this.targetPosition);
    return ActionResult.SUCCESS;
  }
}
