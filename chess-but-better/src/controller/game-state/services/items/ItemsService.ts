import { isEqual } from "lodash";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { IItemsService } from "./abstract/IItemsService";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IEditableItemsStorage } from "../../../storages/items-storage/abstract/IEditableItemsStorage";

export class ItemsService implements IItemsService {
  private itemsStorage: IEditableItemsStorage;

  constructor(itemsStorage: IEditableItemsStorage) {
    this.itemsStorage = itemsStorage;
  }

  getItemByPosition(position: Position): BaseItem | undefined {
    const matchingItems = this.itemsStorage.getItems((item) => isEqual(item.position, position));
    return matchingItems.length === 1 ? matchingItems[0] : undefined;
  }

  useItem(item: BaseItem, target: BasePiece): void {
    item.onTrigger(target);
    this.itemsStorage.removeItem(item);
  }
}
