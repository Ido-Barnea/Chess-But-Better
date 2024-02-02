import { Logger } from '../../ui/Logger';
import { Player } from '../Players';
import { Item } from './Items';


export class Inventory {
  items: Array<Item> = [];

  addItem(item: Item, player: Player) {
    this.items.push(item);
    Logger.logGeneral(`${player.color} received a ${item.name}.`);
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
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
