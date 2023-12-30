import { Logger } from '../../ui/logger';
import { Piece, Position } from '../pieces';
import { PlayerColors } from '../players';

export class Inventory {
  items: Array<Item> = [];

  addItem(playerColor: PlayerColors, item: Item) {
    this.items.push(item);
    Logger.logItemMessage(`${playerColor} received a ${item.name}.`, item.name);
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      Logger.logItemMessage(`${item.name} was destroyed.`, item.name);
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
    apply: (piece: Piece) => void;
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

  apply(piece: Piece) {
    Logger.logItemMessage(
      `${piece.player.color} used a ${this.name}.`,
      this.name,
    );
  };
}
