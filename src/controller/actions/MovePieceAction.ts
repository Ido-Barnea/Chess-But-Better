import { isEqual } from 'lodash';
import { game } from '../../Game';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Position } from '../../model/types/Position';
import { move } from '../PieceLogic';
import { King } from '../pieces/King';
import { Pawn } from '../pieces/Pawn';
import { CastleAction } from './CastleAction';
import { KillPieceByPieceAction } from './KillPieceByPieceAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';
import { IEditablePiecesStorage } from '../game state/storages/pieces storage/abstract/IEditablePiecesStorage';

export class MovePieceAction implements GameAction {
  protected piece: BasePiece;
  protected targetPosition: Position;
  protected piecesStorage: IEditablePiecesStorage;

  constructor(piece: BasePiece, target: Position, piecesStorage: IEditablePiecesStorage) {
    this.piece = piece;
    this.targetPosition = target;
    this.piecesStorage = piecesStorage;
  }

  execute(): ActionResult {
    const isPiecePawn = this.piece instanceof Pawn;
    if (isPiecePawn) {
      const pieceAsPawn = this.piece as Pawn;

      const isPawnDiagonalAttack = pieceAsPawn.diagonalAttackPosition;
      const isSuspectedEnPassant = isEqual(pieceAsPawn.diagonalAttackPosition, this.targetPosition);
      if (isPawnDiagonalAttack && isSuspectedEnPassant) {
        const enPassantPiece = pieceAsPawn.getEnPassantPiece(
          this.targetPosition,
          this.piecesStorage,
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
