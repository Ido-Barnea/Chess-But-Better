import { CauseOfDeath } from "../../../controller/events/handlers/PieceKilledEventHandler";
import { BasePiece } from "../../piece/abstract/BasePiece";
import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class HellBoard extends BaseBoard {
  constructor() {
    super(BoardType.HELL, {light: '#e66545', dark: '#882615'});
  }

  determineNextBoard(_: BasePiece, __: CauseOfDeath): BoardType {
    return BoardType.VOID;
  }
}
