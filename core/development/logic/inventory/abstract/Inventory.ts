import { BaseItem } from '../../items/abstract/Item';
import { InventoryActionResult } from '../types/InventoryActionResult';

export interface Inventory {
  addItem(item: BaseItem): InventoryActionResult;
  removeItem(item: BaseItem): InventoryActionResult;
}
