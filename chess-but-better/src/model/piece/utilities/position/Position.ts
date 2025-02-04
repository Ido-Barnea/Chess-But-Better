import { BaseBoard } from "../../../board/abstract/BaseBoard";
import { Coordinates } from "./Coordinates";

export type Position = {
  coordinates: Coordinates;
  board: BaseBoard;
}
