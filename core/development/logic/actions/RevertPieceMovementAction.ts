import { BasePiece } from '../pieces/abstract/BasePiece';
import { MovePieceAction } from './MovePieceAction';

export class RevertPieceMovementAction extends MovePieceAction {
  constructor(piece: BasePiece) {
    super(piece, piece.position!);
  }
}
