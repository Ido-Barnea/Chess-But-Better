import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { BaseEventHandler } from "../abstract/BaseEventHandler";

export class PieceKilledEventHandler extends BaseEventHandler {
    private piecesStorage: IPiecesStorage;

    constructor(piecesStorage: IPiecesStorage) {
        super();
        this.piecesStorage = piecesStorage;
    }

    handle(context: Record<string, any>): void {
        const piece: BasePiece = context['piece'];
        console.log(`${piece.resource.name} was killed`);
    }
}
