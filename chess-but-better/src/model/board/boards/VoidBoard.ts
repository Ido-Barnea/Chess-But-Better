import { CauseOfDeath } from "../../../controller/events/handlers/PieceKilledEventHandler";
import { BasePiece } from "../../piece/abstract/BasePiece";
import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class VoidBoard extends BaseBoard {
  constructor() {
    super(BoardType.VOID, {light: '', dark: ''});
  }

  determineNextBoard(_: BasePiece, __: CauseOfDeath): BoardType {
    return BoardType.VOID;
  }
}
