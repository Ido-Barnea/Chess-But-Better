import { BaseItem } from '../../../../model/player/inventory/abstract/BaseItem';
import { IItemsStorage } from './IItemsStorage';

export interface IEditableItemsStorage extends IItemsStorage {
  addItem(item: BaseItem, inventorySize: number): void;
  removeItem(item: BaseItem): void;
}
