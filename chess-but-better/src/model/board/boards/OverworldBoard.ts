import { CauseOfDeath } from "../../../controller/events/handlers/PieceKilledEventHandler";
import { BasePiece } from "../../piece/abstract/BasePiece";
import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class OverworldBoard extends BaseBoard {
  constructor() {
    super(BoardType.OVERWORLD, {light: '#c7ec8a', dark: '#88b65a'}, [BoardType.HEAVEN, BoardType.HELL]);
  }

  determineNextBoard(piece: BasePiece, causeOfDeath: CauseOfDeath): BoardType {
    if (causeOfDeath === CauseOfDeath.GOD) return BoardType.VOID;

    if (piece.stats.kills > 0) {
      return BoardType.HELL;
    } else {
      return BoardType.HEAVEN;
    }
  }
}
