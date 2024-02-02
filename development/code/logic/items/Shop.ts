import { isPlayerAllowedToAct } from '../PieceLogic';
import { Player } from '../Players';
import { Item } from './Items';
import { Trap } from './Trap';

export class Shop {
  items: Array<Item> = [
    new Trap(),
  ];

  buy(item: Item, player: Player) {
    if (isPlayerAllowedToAct(player) && player.gold >= item.price) {
      player.gold -= item.price;
      player.inventory.addItem(item, player);
    }
  }
}
