import { BoardType } from "../BoardTypes";
import { BaseBoard } from "../abstract/BaseBoard";

export class HeavenBoard extends BaseBoard {
  constructor() {
    super(BoardType.HEAVEN, {light: '#a1e3f5', dark: '#0da5ce'});
  }
}
