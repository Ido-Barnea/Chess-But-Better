import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { IKillerPieceSwitcher } from './abstract/IKillerPieceSwitcher';

export class KillerPieceSwitcher implements IKillerPieceSwitcher {
  private killerPiece: BasePiece | undefined;

  constructor() {
    this.killerPiece = undefined;
  }

  getKillerPiece(): BasePiece | undefined {
    return this.killerPiece;
  }

  setKillerPiece(piece: BasePiece): void {
    this.killerPiece = piece;
  }

  resetKillerPiece(): void {
    this.killerPiece = undefined;
  }
}
