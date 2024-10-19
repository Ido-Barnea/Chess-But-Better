import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { IFellOffTheBoardPieceSwitcher } from './abstract/IFellOffTheBoardPieceSwitcher';

export class FellOffTheBoardPieceSwitcher implements IFellOffTheBoardPieceSwitcher {
  private fellOffTheBoardPiece: BasePiece | undefined;

  constructor() {
    this.fellOffTheBoardPiece = undefined;
  }

  getPiece(): BasePiece | undefined {
    return this.fellOffTheBoardPiece;
  }

  setPiece(piece: BasePiece): void {
    this.fellOffTheBoardPiece = piece;
  }

  resetPiece(): void {
    this.fellOffTheBoardPiece = undefined;
  }
}
