import { ITurnSwitcher } from '../game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { IEndOfMoveHandler } from './abstract/IEndOfMoveHandler';

export class TurnSwitcherHandler implements IEndOfMoveHandler {
  constructor(private turnSwitcher: ITurnSwitcher) {}

  handle(): void {
    this.turnSwitcher.nextTurn();
  }
}