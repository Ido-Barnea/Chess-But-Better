import { InventoryActionResult } from '../inventory/types/InventoryActionResult';
import { isPlayerAllowedToAct } from '../PieceLogic';
import { Player } from '../game state/storages/players storage/Player';
import { BaseItem } from '../items/abstract/Item';
import { Shield } from '../items/Shield';
import { Trap } from '../items/Trap';
import { Shop } from './abstract/Shop';
import { ShopActionResult } from './types/ShopActionResult';

export class ItemsShop implements Shop {
  private _items: Array<BaseItem>;

  constructor() {
    this._items = [new Trap(), new Shield()];
  }

  buyItem(item: BaseItem, player: Player): ShopActionResult {
    if (
      isPlayerAllowedToAct(player) &&
      player.gold >= item.price &&
      player.inventory.addItem(item) == InventoryActionResult.SUCCESS
    ) {
      player.gold -= item.price;
      return ShopActionResult.SUCCESS;
    }

    return ShopActionResult.FAILURE;
  }

  getItems(): BaseItem[] {
    return this._items;
  }
}
