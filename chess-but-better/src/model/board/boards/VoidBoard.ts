import { Position } from "../../piece/utilities/position/Position";
import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class VoidBoard extends BaseBoard {
  constructor() {
    super(BoardType.VOID);
  }

  isPositionValid(_: Position): boolean {
      return false;
  }
}
