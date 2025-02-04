import { ITurnCounter } from "../../../game-state/counters/turn-counter/abstract/ITurnCounter";
import { IEventHandler } from "../../abstract/IEventHandler";

export class TurnCounterHandler implements IEventHandler {
  turnCounter: ITurnCounter;

  constructor(turnCounter: ITurnCounter) {
    this.turnCounter = turnCounter;
  }

  handle(): void {
    this.turnCounter.nextTurn();
  }
}
