import { IEndOfMoveHandler } from './abstract/IEndOfMoveHandler';

export class EndTurnHandler implements IEndOfMoveHandler {
  constructor(private game: Game) {}

  handle(): void {
    this.game.endTurn();
  }
}
