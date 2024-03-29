import { Log } from '../../ui/logs/Log';
import { INVENTORY_WIDTH } from '../../Constants';
import { Player } from '../players/Player';
import { BaseItem } from './abstract/Item';
import { Logger } from '../../ui/logs/Logger';

export class Inventory {
  items: Array<BaseItem> = [];
  player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  addItem(item: BaseItem): boolean {
    if (this.items.length >= INVENTORY_WIDTH) return false;
    this.items.push(item);
    new Log(`${this.player.color} received a ${item.name}.`).addToQueue();
    Logger.logMessages();
    return true;
  }

  removeItem(item: BaseItem) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
