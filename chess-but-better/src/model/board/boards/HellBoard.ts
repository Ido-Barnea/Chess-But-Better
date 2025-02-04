import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class HellBoard extends BaseBoard {
  constructor() {
    super(BoardType.HELL, {light: '#e66545', dark: '#882615'});
  }
}
