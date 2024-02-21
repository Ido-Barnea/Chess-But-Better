import { Log } from '../../ui/logs/Log';
import { INVENTORY_WIDTH } from '../../Constants';
import { Player } from '../Players';
import { Item } from './Items';

export class Inventory {
  items: Array<Item> = [];
  player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  addItem(item: Item): boolean {
    if (this.items.length >= INVENTORY_WIDTH) return false;
    this.items.push(item);
    new Log(`${this.player.color} received a ${item.name}.`).addToQueue();
    return true;
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
