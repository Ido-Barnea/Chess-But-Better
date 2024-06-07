import { IMovesCounter } from '../game state/counters/moves counter/abstract/IMovesCounter';
import { IEndOfMoveHandler } from './abstract/IEndOfMoveHandler';

export class MoveCountHandler implements IEndOfMoveHandler {
  constructor(private movesCounter: IMovesCounter) {}

  handle(): void {
    this.movesCounter.decreaseRemainingMovesCount();
  }
}