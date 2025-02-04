import { CauseOfDeath } from "../../../controller/events/handlers/PieceKilledEventHandler";
import { BasePiece } from "../../piece/abstract/BasePiece";
import { BoardColors } from "../BoardColors";
import { BoardSize } from "../BoardSize";
import { BoardType } from "../BoardTypes";

export abstract class BaseBoard {
  name: BoardType;
  colors: BoardColors;
  availableNextBoards: Array<BoardType>;
  size: BoardSize;

  constructor(name: BoardType, colors: BoardColors, availableNextBoards: Array<BoardType> = [], size: BoardSize = {width: 8, height: 8}) {
    this.name = name;
    this.colors = colors;
    this.availableNextBoards = availableNextBoards;
    this.size = size;
  }

  abstract determineNextBoard(piece: BasePiece, causeOfDeath: CauseOfDeath): BoardType;
}
