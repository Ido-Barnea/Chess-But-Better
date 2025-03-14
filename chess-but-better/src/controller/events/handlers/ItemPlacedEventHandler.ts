import { isEqual } from "lodash";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { Position } from "../../../model/piece/utilities/position/Position";
import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { IItemsStorage } from "../../storages/items-storage/abstract/IItemsStorage";
import { BaseItem } from "../../../model/player/inventory/abstract/BaseItem";
import { TileOccupantType } from "../../game-state/services/board/TileOccupantType";

export class ItemPlacedEventHandler extends BaseEventHandler {
    private piecesStorage: IPiecesStorage;
    private itemsStorage: IItemsStorage;

    constructor(piecesStorage: IPiecesStorage, itemsStorage: IItemsStorage) {
        super();
        this.piecesStorage = piecesStorage;
        this.itemsStorage = itemsStorage;
    }
    
    determineTileOccupantByPosition(position: Position): TileOccupantType {
        const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position, position));
        if (matchingPieces.length > 0) TileOccupantType.PIECE;

        const matchingItems = this.itemsStorage.getItems((item) => isEqual(item.position, position));
        if (matchingItems.length > 0) return TileOccupantType.ITEM;

        return TileOccupantType.EMPTY;
    }

    handle(context: Record<string, any>): void {
        const item: BaseItem = context['item'];
        const position: Position = context['position'];

        const occupantType = this.determineTileOccupantByPosition(position);
        if (item.isValidPlacement(occupantType)) {
            item.position = position;
        }
    }
}
