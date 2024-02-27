import { Log } from '../../ui/logs/Log';
import { Position } from '../pieces/PiecesUtilities';
import { Player } from '../Players';

export abstract class Item {
  name: string;
  resource: string;
  price: number;
  position: Position | undefined;

  constructor(
    name: string,
    resource: string,
    price: number,
    position?: Position,
  ) {
    this.name = name;
    this.resource = resource;
    this.price = price;
    this.position = position;
  }

  setPosition(position: Position) {
    this.position = position;
  }

  drop(player: Player) {
    new Log(`${player.color} dropped a ${this.name}.`).addToQueue();
  }

  abstract use(position: Position): void;
}
