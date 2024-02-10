import { INVENTORY_CLASS_ID, INVENTORY_WIDTH } from '../Constants';
import { Log } from '../../ui/logs/Log';
import { Player } from '../Players';
import { Item } from './Items';

export class Inventory {
  items: Array<Item> = [];
  player: Player;

  constructor(_player: Player) {
    this.player = _player;
  }

  addItem(item: Item) {
    this.items.push(item);
    new Log(`${this.player.color} received a ${item.name}.`).addToQueue();
  }

  removeItem(item: Item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
