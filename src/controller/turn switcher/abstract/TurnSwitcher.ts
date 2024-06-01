import { Player } from '../../players/Player';

export interface TurnSwitcher {
  getCurrentPlayer(): Player;
  nextTurn(): Player;
  getTurnsCount(): number;
}
