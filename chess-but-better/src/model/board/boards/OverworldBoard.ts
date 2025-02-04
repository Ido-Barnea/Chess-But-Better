import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class OverworldBoard extends BaseBoard {
  constructor() {
    super(BoardType.OVERWORLD, {light: '#c7ec8a', dark: '#88b65a'});
  }
}
