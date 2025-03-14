import { Position } from "../../../model/piece/utilities/position/Position";
import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { BaseItem } from "../../../model/player/inventory/abstract/BaseItem";
import { TileOccupantType } from "../../game-state/services/board/TileOccupantType";
import { IPiecesService } from "../../game-state/services/pieces/abstract/IPiecesService";
import { IItemsService } from "../../game-state/services/items/abstract/IItemsService";

export class ItemPlacedEventHandler extends BaseEventHandler {
    private piecesService: IPiecesService;
    private itemsService: IItemsService;

    constructor(piecesService: IPiecesService, itemsService: IItemsService) {
        super();
        this.piecesService = piecesService;
        this.itemsService = itemsService;
    }
    
    determineTileOccupantByPosition(position: Position): TileOccupantType {
        const matchingPiece = this.piecesService.getPieceByPosition(position);
        if (matchingPiece) TileOccupantType.PIECE;

        const matchingItem = this.itemsService.getItemByPosition(position);
        if (matchingItem) return TileOccupantType.ITEM;

        return TileOccupantType.EMPTY;
    }

    handle(context: Record<string, any>): void {
        const item: BaseItem = context['item'];
        const position: Position = context['position'];

        console.log(item, position);

        const occupantType = this.determineTileOccupantByPosition(position);
        if (item.isValidPlacement(occupantType)) {
            item.position = position;
        }
    }
}
