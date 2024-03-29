import { InventoryActionResult } from '../inventory/types/InventoryActionResult';
import { isPlayerAllowedToAct } from '../PieceLogic';
import { Player } from '../players/Player';
import { BaseItem } from './abstract/Item';
import { Shield } from './Shield';
import { Trap } from './Trap';

export class Shop {
  items: Array<BaseItem> = [new Trap(), new Shield()];

  buy(item: BaseItem, player: Player): boolean {
    if (
      isPlayerAllowedToAct(player) &&
      player.gold >= item.price &&
      player.inventory.addItem(item) == InventoryActionResult.SUCCESS
    ) {
      player.gold -= item.price;
      return true;
    }
    return false;
  }
}
