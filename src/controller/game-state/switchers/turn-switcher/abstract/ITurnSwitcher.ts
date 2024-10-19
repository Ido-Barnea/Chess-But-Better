import { Player } from '../../../storages/players-storage/Player';

export interface TurnChangeListener {
  onTurnChange: (currentPlayer: Player, turnsCount: number) => void;
}

export interface ITurnSwitcher {
  getCurrentPlayer(): Player;
  nextTurn(): Player;
  getTurnsCount(): number;
  subscribeToTurnChanges(listener: TurnChangeListener): void;
  unsubscribeFromTurnChanges(listener: TurnChangeListener): void
}
