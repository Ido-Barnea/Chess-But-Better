import { isEqual } from 'lodash';
import { IEditablePiecesStorage } from './abstract/IEditablePiecesStorage';
import { BasePiece } from '../../../model/piece/abstract/BasePiece';

export class PiecesStorage implements IEditablePiecesStorage {
  private pieces: Array<BasePiece>;

  constructor(pieces: Array<BasePiece>) {
    this.pieces = pieces;
  }

  getPieces(filter: (piece: BasePiece) => boolean = () => true): Array<BasePiece> {
    return this.pieces.filter(filter);
  }

  addPiece(piece: BasePiece): void {
    this.pieces.push(piece);
  }

  removePiece(piece: BasePiece): void {
    this.pieces = this.pieces.filter(existingPiece => !isEqual(existingPiece, piece));
  }
}
