import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";

export interface IItemsStorage {
  getItems(filter?: (item: BaseItem) => boolean): Array<BaseItem | undefined>;
}
