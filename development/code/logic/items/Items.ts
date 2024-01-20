import { Logger } from '../../ui/Logger';
import { Piece } from '../pieces/Pieces';
import { Position } from '../pieces/PiecesUtilities';
import { Player, PlayerColors } from '../Players';

export class Inventory {
  items: Array<Item> = [];

  addItem(playerColor: PlayerColors, item: Item) {
    this.items.push(item);
    Logger.logGeneral(`${playerColor} received a ${item.name}.`);
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
    position: Position,
    use: (piece: Piece) => void;
    drop: (player: Player) => void;
}

export class Item implements ItemType {
  name: string;
  resource: string;
  position: Position;

  constructor(
    name: string,
    resource: string,
    position: Position,
  ) {
    this.name = name;
    this.resource = resource;
    this.position = position;
  }

  use(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} used a ${this.name} on ${piece.position.coordinates}.`);
  }

  drop(player: Player) {
    Logger.logGeneral(`${player.color} dropped a ${this.name}.`);
  }
}
