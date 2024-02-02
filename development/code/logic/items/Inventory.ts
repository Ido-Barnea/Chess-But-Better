import { Logger } from '../../ui/Logger';
import { PlayerColors } from '../Players';
import { Item } from './Items';


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
