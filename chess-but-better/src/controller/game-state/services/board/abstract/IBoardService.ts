import { BaseBoard } from "../../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { Position } from "../../../../../model/piece/utilities/position/Position";

export interface IBoardService {
  retrievePopulatedBoards: () => Array<BaseBoard>;
  getPieceAt(position: Position): BasePiece | undefined;
  movePiece(piece: BasePiece, to: Position): void;
}