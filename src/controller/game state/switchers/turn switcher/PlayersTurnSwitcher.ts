import { Player } from '../../storages/players storage/Player';
import { ITurnSwitcher, TurnChangeListener } from './abstract/ITurnSwitcher';

export class PlayersTurnSwitcher implements ITurnSwitcher {
  private players: Array<Player>;
  private currentPlayerIndex: number;
  private turnsCount: number;
  private turnChangeListeners: Array<TurnChangeListener>;

  constructor(players: Array<Player>) {
    this.players = players;
    this.currentPlayerIndex = 0;
    this.turnsCount = 1;
    this.turnChangeListeners = [];
  }

  getTurnsCount(): number {
    return this.turnsCount;
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  
  nextTurn(): Player {
    if (this.currentPlayerIndex + 1 == this.players.length) {
      this.currentPlayerIndex = 0;
    } else {
      this.currentPlayerIndex++;
    }

    this.turnsCount++;

    this.notifyTurnChangeListeners();

    return this.getCurrentPlayer();
  }

  subscribeToTurnChanges(listener: TurnChangeListener): void {
    this.turnChangeListeners.push(listener);
  }

  unsubscribeFromTurnChanges(listener: TurnChangeListener): void {
    this.turnChangeListeners = this.turnChangeListeners.filter(
      existingListener => existingListener !== listener
    );
  }

  private notifyTurnChangeListeners() {
    const currentPlayer = this.getCurrentPlayer();
    const turnsCount = this.getTurnsCount();
    this.turnChangeListeners.forEach(listener => {
      listener.onTurnChange(currentPlayer, turnsCount);
    });
  }
}
