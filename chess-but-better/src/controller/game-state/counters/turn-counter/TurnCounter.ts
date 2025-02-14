import { Player } from "../../../../model/player/Player";
import { IPlayersStorage } from "../../../storages/players-storage/abstract/IPlayersStorage";
import { ITurnCounter } from "./abstract/ITurnCounter";

export class TurnCounter implements ITurnCounter {
  private turnCount: number;
  private roundCount: number;

  private currentPlayerIndex: number;
  private playersStorage: IPlayersStorage;

  constructor(playersStorage: IPlayersStorage) {
    this.turnCount = 0;
    this.roundCount = 0;
    this.currentPlayerIndex = 0;
    this.playersStorage = playersStorage;
  }

  nextTurn(): void {
    if (this.currentPlayerIndex + 1 == this.playersStorage.getPlayersCount()) {
      this.currentPlayerIndex = 0;
      this.roundCount++;
    } else {
      this.currentPlayerIndex++;
    }

    this.turnCount++;
  }

  getTurnCount(): number {
    return this.turnCount;
  }

  getRoundCount(): number {
    return this.roundCount;
  }

  getCurrentPlayer(): Player {
    return this.playersStorage.getPlayers()[this.currentPlayerIndex];
  }
}
