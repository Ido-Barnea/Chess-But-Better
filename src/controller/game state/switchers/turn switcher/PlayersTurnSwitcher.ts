import { Player } from '../../storages/players storage/Player';
import { ITurnSwitcher } from './abstract/ITurnSwitcher';

export class PlayersTurnSwitcher implements ITurnSwitcher {
  private players: Array<Player>;
  private currentPlayerIndex: number;
  private turnsCount;

  constructor(players: Array<Player>) {
    this.players = players;
    this.currentPlayerIndex = 0;
    this.turnsCount = 1;
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
    return this.getCurrentPlayer();
  }
}
