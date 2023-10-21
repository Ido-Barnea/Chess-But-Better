import { spawnItemOnBoard } from './boards';
import { Logger } from './logger';
import { items } from './logic';
import { Piece } from './pieces';
import { Player } from './players';
import { trapResource } from './resources';

export class Inventory {
  items: Array<Item> = [];

  addItem(item: Item) {
    this.items.push(item);
    Logger.log(`${item.player.color} received a ${item.name}.`);
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    delete this.items[index];
    Logger.log(`${item.name} was destroyed.`);
  }
}

interface ItemType {
    name: string,
    resource: string,
    player: Player,
    position: [number, number],
    board: string,
    apply: (piece: Piece) => void;
}

export class Item implements ItemType {
  name: string;
  resource: string;
  player: Player;
  position: [number, number];
  board: string;

  constructor(name: string, resource: string, player: Player, position: [number, number], board: string) {
    this.name = name;
    this.resource = resource;
    this.player = player;
    this.position = position;
    this.board = board;
  }

  apply(piece: Piece) {
    Logger.log(`${piece.player.color} used a ${this.name}.`);
  };
}

export class Trap extends Item {
  constructor(player: Player, position: [number, number], board: string) {
    super('trap', trapResource, player, position, board);
  }

  apply(piece: Piece) {
    Logger.log(`${this.player.color} ${piece.name} placed a ${this.name} on ${piece.position}.`);

    this.position = piece.position;
    this.board = piece.board;
    items.push(this);

    spawnItemOnBoard(this);
  }
}
