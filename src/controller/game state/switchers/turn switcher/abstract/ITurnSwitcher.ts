import { Player } from '../../../storages/players storage/Player';

export interface ITurnSwitcher {
  getCurrentPlayer(): Player;
  nextTurn(): Player;
  getTurnsCount(): number;
}
