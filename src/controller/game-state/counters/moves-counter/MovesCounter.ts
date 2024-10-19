import { IMovesCounter } from './abstract/IMovesCounter';

export class MovesCounter implements IMovesCounter {
  private remainingMovesCount;

  constructor(remainingMovesCount=0) {
    this.remainingMovesCount = remainingMovesCount;
  }

  getRemainingMovesCount(): number {
    return this.remainingMovesCount;
  }

  setRemainingMovesCount(count: number): void {
    this.remainingMovesCount = count;
  }

  decreaseRemainingMovesCount(): void {
    this.remainingMovesCount--;
  }

  resetRemainingMovesCount(): void {
    this.remainingMovesCount = 0;
  }
}
