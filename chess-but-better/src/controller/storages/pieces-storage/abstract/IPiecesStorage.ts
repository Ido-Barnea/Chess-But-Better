import { BasePiece } from "../../../../model/piece/abstract/BasePiece";

export interface IPiecesStorage {
  getPieces(filter?: (piece: BasePiece) => boolean): Array<BasePiece>;
}
