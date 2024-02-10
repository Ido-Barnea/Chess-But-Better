import { Log } from '../../ui/logger/Log';
import { Piece } from '../pieces/Piece';
import { Position } from '../pieces/PiecesUtilities';
import { Player } from '../Players';

interface ItemType {
    name: string,
    resource: string,
    price: number,
    position?: Position | undefined,
    use: (piece: Piece) => void;
    drop: (player: Player) => void;
}

export abstract class Item implements ItemType {
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

  abstract use(piece: Piece): void;
}
