import { Item } from './Items';
import { trapResource } from '../../ui/Resources';
import { spawnItemOnBoard } from '../../LogicAdapter';
import { game } from '../../Game';
import { Position } from '../pieces/PiecesUtilities';
import { Log } from '../../ui/logs/Log';

export class Trap extends Item {
  constructor(position?: Position) {
    super('trap', trapResource, 3, position);
  }

  use(position: Position): void {
    const currentPlayer = game.getCurrentPlayer();

    new Log(
      `${currentPlayer.color} placed a ${this.name} on ${position.coordinates}.`,
    ).addToQueue();

    this.position = position;
    game.getItems().push(this);

    spawnItemOnBoard(this);
  }
}
