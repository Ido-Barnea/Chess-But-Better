import { BoardColors } from "../BoardColors";
import { BoardSize } from "../BoardSize";
import { BoardType } from "../BoardTypes";

export abstract class BaseBoard {
  name: BoardType;
  colors: BoardColors;
  size: BoardSize;

  constructor(name: BoardType, colors: BoardColors, size: BoardSize = {width: 8, height: 8}) {
    this.name = name;
    this.colors = colors;
    this.size = size;
  }
}
