import { spawnItemOnBoard } from './boards';
import { Logger } from './logger';
import { items } from './logic';
import { Piece, Position } from './pieces';
import { Player } from './players';
import { trapResource } from './resources';

export class Inventory {
  items: Array<Item> = [];

  addItem(item: Item) {
    this.items.push(item);
    Logger.logGeneral(`${item.player.color} received a ${item.name}.`);
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      Logger.logGeneral(`${item.name} was destroyed.`);
    }
  }

  toHTMLElement(): HTMLElement {
    const inventoryElement = document.createElement('ul');
    this.items.forEach((item) => {
      const inventoryItemElement = document.createElement('li');
      inventoryItemElement.innerHTML = item.name;

      inventoryElement.appendChild(inventoryItemElement);
    });

    return inventoryElement;
  }
}

interface ItemType {
    name: string,
    resource: string,
    player: Player,
    position: Position,
    apply: (piece: Piece) => void;
}

export class Item implements ItemType {
  name: string;
  resource: string;
  player: Player;
  position: Position;

  constructor(
    name: string,
    resource: string,
    player: Player,
    position: Position,
  ) {
    this.name = name;
    this.resource = resource;
    this.player = player;
    this.position = position;
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} used a ${this.name}.`);
  };
}

export class Trap extends Item {
  constructor(player: Player, position: Position) {
    super('trap', trapResource, player, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${this.player.color} ${piece.name} 
      placed a ${this.name} on ${piece.position.coordinates}.`);

    this.position = piece.position;
    items.push(this);

    spawnItemOnBoard(this);
  }
}
