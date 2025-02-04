import { isEqual } from "lodash";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { GameEventEmitter } from "../GameEventEmitter";
import { EventType } from "../Events";
import { CauseOfDeath } from "./PieceKilledEventHandler";

export class PieceSpawnedEventHandler extends BaseEventHandler {
    private eventEmitter: GameEventEmitter;
    private piecesStorage: IPiecesStorage;

    constructor(eventEmitter: GameEventEmitter, piecesStorage: IPiecesStorage) {
        super();
        this.eventEmitter = eventEmitter;
        this.piecesStorage = piecesStorage;
    }

    retrievePieceOnSameTile(piece: BasePiece): BasePiece | undefined {
        const matchingPieces = this.piecesStorage.getPieces((p) => isEqual(p.position, piece.position));
        const otherMatchingPieces = matchingPieces.filter((p) => !isEqual(p, piece));

        return otherMatchingPieces.length > 0 ? otherMatchingPieces[0] : undefined;
    }

    handle(context: Record<string, any>): void {
        const piece: BasePiece = context['piece'];
        piece.health.restoreHealth(piece.health.maxHealth);
        const pieceSpawnedOn = this.retrievePieceOnSameTile(piece);

        if (pieceSpawnedOn) {
            this.eventEmitter.emit(EventType.PIECE_KILLED, {piece: pieceSpawnedOn, causeOfDeath: CauseOfDeath.PLAYER});
        }
    }
}
