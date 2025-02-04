import { BaseBoard } from "../../../../../model/board/abstract/BaseBoard";

export interface IBoardService {
  retrievePopulatedBoards: () => Array<BaseBoard>;
}