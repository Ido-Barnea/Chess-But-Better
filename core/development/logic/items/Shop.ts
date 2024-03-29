import { isPlayerAllowedToAct } from '../PieceLogic';
import { Player } from '../players/Player';
import { Item } from './Items';
import { Shield } from './Shield';
import { Trap } from './Trap';

export class Shop {
  items: Array<Item> = [new Trap(), new Shield()];

  buy(item: Item, player: Player): boolean {
    if (
      isPlayerAllowedToAct(player) &&
      player.gold >= item.price &&
      player.inventory.addItem(item)
    ) {
      player.gold -= item.price;
      return true;
    }
    return false;
  }
}
