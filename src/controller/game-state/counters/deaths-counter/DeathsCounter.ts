import { IDeathsCounter } from './abstract/IDeathsCounter';

export class DeathsCounter implements IDeathsCounter {
  private counter: number;

  constructor() {
    this.counter = 0;
  }

  getCount(): number {
    return this.counter;
  }

  increaseCount(): void {
    this.counter++;
  }
}
