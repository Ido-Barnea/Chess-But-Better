import { INVENTORY_WIDTH } from '../../Constants';
import { BaseItem } from '../items/abstract/Item';
import { Inventory } from './abstract/Inventory';
import { InventoryActionResult } from './types/InventoryActionResult';

export class PlayerInventory implements Inventory {
  public items: Array<BaseItem> = [];

  addItem(item: BaseItem): InventoryActionResult {
    if (this.items.length >= INVENTORY_WIDTH) {
      return InventoryActionResult.FAILURE;
    }

    this.items.push(item);
    return InventoryActionResult.SUCCESS;
  }

  removeItem(item: BaseItem): InventoryActionResult {
    const index = this.items.indexOf(item);
    if (index == -1) {
      return InventoryActionResult.FAILURE;
    }

    this.items.splice(index, 1);
    return InventoryActionResult.SUCCESS;
  }
}
