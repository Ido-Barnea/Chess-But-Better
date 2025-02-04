import { Position } from "../../piece/utilities/position/Position";
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

  isPositionValid(position: Position): boolean {
    return this.isPositionWithinBound(position);
  }

  private isPositionWithinBound(position: Position) {
    const isWithinBoard = position.board.name === this.name;
    const isWithinHorizontalBounds = position.coordinates.x >= 0 && position.coordinates.x < this.size.width;
    const isWithinVerticalBounds = position.coordinates.y >= 0 && position.coordinates.y < this.size.height;
    return isWithinBoard && isWithinHorizontalBounds && isWithinVerticalBounds;
  }
}
