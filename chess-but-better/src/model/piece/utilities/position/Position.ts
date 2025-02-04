import { BaseBoard } from "../../../board/abstract/BaseBoard";
import { Coordinates } from "./Coordinates";

export class Position {
  coordinates: Coordinates;
  board: BaseBoard;

  constructor(coordinates: Coordinates, board: BaseBoard) {
    this.coordinates = coordinates;
    this.board = board;
  }
}
