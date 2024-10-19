import { BasePiece } from '../../../../../model/pieces/abstract/BasePiece';

export interface IKillerPieceSwitcher {
  getKillerPiece(): BasePiece | undefined;
  setKillerPiece(piece: BasePiece): void;
  resetKillerPiece(): void;
}
