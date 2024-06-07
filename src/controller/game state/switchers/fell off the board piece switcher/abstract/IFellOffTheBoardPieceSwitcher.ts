import { BasePiece } from '../../../../../model/pieces/abstract/BasePiece';

export interface IFellOffTheBoardPieceSwitcher {
  getPiece(): BasePiece | undefined;
  setPiece(piece: BasePiece): void;
  resetPiece(): void;
}
