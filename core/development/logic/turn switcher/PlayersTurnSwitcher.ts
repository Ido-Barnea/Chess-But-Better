import { Player } from '../players/Player';
import { TurnSwitcher } from './abstract/TurnSwitcher';

export class PlayersTurnSwitcher implements TurnSwitcher {
  private _players: Array<Player>;
  private _currentPlayerIndex: number;
  private _turnsCount;

  constructor(players: Array<Player>) {
    this._players = players;
    this._currentPlayerIndex = 0;
    this._turnsCount = 1;
  }

  getTurnsCount(): number {
    return this._turnsCount;
  }

  getCurrentPlayer(): Player {
    return this._players[this._currentPlayerIndex];
  }
  nextTurn(): Player {
    if (this._currentPlayerIndex + 1 == this._players.length) {
      this._currentPlayerIndex = 0;
    } else {
      this._currentPlayerIndex++;
    }

    this._turnsCount++;
    return this.getCurrentPlayer();
  }
}
