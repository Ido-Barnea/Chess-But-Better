import { BaseBoard } from "../../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { Coordinates } from "../../../../../model/piece/utilities/position/Coordinates";

export interface IBoardService {
  retrievePopulatedBoards: () => Array<BaseBoard>;
  getPieceAt(coordinates: Coordinates): BasePiece | undefined;
  movePiece(from: Coordinates, to: Coordinates): void;
}