import { isEqual } from "lodash";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { IItemsService } from "./abstract/IItemsService";
import { IItemsStorage } from "../../../storages/items-storage/abstract/IItemsStorage";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";

export class ItemsService implements IItemsService {
  private itemsStorage: IItemsStorage;

  constructor(itemsStorage: IItemsStorage) {
    this.itemsStorage = itemsStorage;
  }

  getItemByPosition(position: Position): BaseItem | undefined {
    const matchingItems = this.itemsStorage.getItems((item) => isEqual(item.position, position));
    return matchingItems.length === 1 ? matchingItems[0] : undefined;
  }
}
