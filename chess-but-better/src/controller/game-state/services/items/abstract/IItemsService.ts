import { Position } from "../../../../../model/piece/utilities/position/Position";
import { BaseItem } from "../../../../../model/player/inventory/abstract/BaseItem";

export interface IItemsService {
    getItemByPosition(position: Position): BaseItem | undefined;
}
