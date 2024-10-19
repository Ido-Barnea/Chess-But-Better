import { BasePiece } from '../../../../../model/pieces/abstract/BasePiece';

export interface IPiecesStorage {
  getPieces(filter?: (piece: BasePiece) => boolean): Array<BasePiece>;
}
