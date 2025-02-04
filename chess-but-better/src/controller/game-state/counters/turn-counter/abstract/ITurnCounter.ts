import { Player } from "../../../../../model/player/Player";

export interface ITurnCounter {
  nextTurn(): void;
  getTurnCount(): number;
  getCurrentPlayer(): Player;
}
