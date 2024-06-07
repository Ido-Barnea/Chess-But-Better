import { isEqual } from 'lodash';
import { BasePiece } from '../../../../model/pieces/abstract/BasePiece';
import { IEditablePiecesStorage } from './abstract/IEditablePiecesStorage';

export class PiecesStorage implements IEditablePiecesStorage {
  private pieces: Array<BasePiece>;

  constructor(pieces: Array<BasePiece>) {
    this.pieces = pieces;
  }

  getPieces(filter: (piece: BasePiece) => boolean = () => true): BasePiece[] {
    return this.pieces.filter(filter);
  }

  addPiece(piece: BasePiece): void {
    this.pieces.push(piece);
  }

  removePiece(piece: BasePiece): void {
    this.pieces = this.pieces.filter(existingPiece => !isEqual(existingPiece, piece));
  }
}
