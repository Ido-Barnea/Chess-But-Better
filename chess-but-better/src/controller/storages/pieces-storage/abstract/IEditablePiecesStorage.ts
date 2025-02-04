import { BasePiece } from '../../../../model/piece/abstract/BasePiece';
import { IPiecesStorage } from './IPiecesStorage';

export interface IEditablePiecesStorage extends IPiecesStorage {
  addPiece(piece: BasePiece): void;
  removePiece(piece: BasePiece): void;
}
