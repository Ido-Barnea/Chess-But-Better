import { isEqual } from 'lodash';
import { IEditableItemsStorage } from './abstract/IEditableItemsStorage';
import { BaseItem } from '../../../model/player/inventory/abstract/BaseItem';

export class ItemsStorage implements IEditableItemsStorage {
  private items: Array<BaseItem>;

  constructor(items: Array<BaseItem>) {
    this.items = items;
  }

  getItems(filter: (item: BaseItem) => boolean = () => true): Array<BaseItem> {
    return this.items.filter(filter);
  }

  addItem(item: BaseItem, inventorySize: number = 4): void {
    if (this.items.length + 1 > inventorySize) return;

    this.items.push(item);
  }

  removeItem(item: BaseItem): void {
    this.items = this.items.filter(existingItem => !isEqual(existingItem, item));
  }
}
