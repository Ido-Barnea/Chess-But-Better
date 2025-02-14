import { Player } from "../../../../../model/player/Player";

export interface ITurnCounter {
  nextTurn(): void;
  getTurnCount(): number;
  getRoundCount(): number;
  getCurrentPlayer(): Player;
}
