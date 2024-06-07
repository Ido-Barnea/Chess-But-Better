import { BasePiece } from '../../../../../model/pieces/abstract/BasePiece';
import { IPiecesStorage } from './IPiecesStorage';

export interface IEditablePiecesStorage extends IPiecesStorage {
  addPiece(piece: BasePiece): void;
  removePiece(piece: BasePiece): void;
}
