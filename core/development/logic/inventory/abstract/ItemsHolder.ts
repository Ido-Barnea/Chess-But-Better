import { BaseItem } from '../../items/abstract/Item';
import { InventoryActionResult } from '../types/InventoryActionResult';

export interface ItemsHolder {
  getItems(): Array<BaseItem>;
  addItem(item: BaseItem): InventoryActionResult;
  removeItem(item: BaseItem): InventoryActionResult;
}
