import { BaseBoard } from "../../../../../model/board/abstract/BaseBoard";
import { BoardType } from "../../../../../model/board/BoardTypes";
import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { Position } from "../../../../../model/piece/utilities/position/Position";

export interface IBoardService {
  getBoard: (type: BoardType) => BaseBoard;
  retrievePopulatedBoards: () => Array<BaseBoard>;
  movePiece(piece: BasePiece, to: Position): void;
  copyPosition(position: Position): Position;
}