import { INVENTORY_WIDTH } from '../../Constants';
import { BaseItem } from '../items/abstract/Item';
import { ItemsHolder } from './abstract/ItemsHolder';
import { InventoryActionResult } from './types/InventoryActionResult';

export class PlayerInventory implements ItemsHolder {
  private _items: Array<BaseItem>;

  constructor() {
    this._items = [];
  }
  
  getItems(): BaseItem[] {
    return this._items;
  }

  addItem(item: BaseItem): InventoryActionResult {
    if (this._items.length >= INVENTORY_WIDTH) {
      return InventoryActionResult.FAILURE;
    }

    this._items.push(item);
    return InventoryActionResult.SUCCESS;
  }

  removeItem(item: BaseItem): InventoryActionResult {
    const index = this._items.indexOf(item);
    if (index == -1) {
      return InventoryActionResult.FAILURE;
    }

    this._items.splice(index, 1);
    return InventoryActionResult.SUCCESS;
  }
}
