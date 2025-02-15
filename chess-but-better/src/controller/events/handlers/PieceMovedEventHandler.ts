import { isEqual } from "lodash";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { Position } from "../../../model/piece/utilities/position/Position";
import { EventType } from "../Events";
import { GameEventEmitter } from "../GameEventEmitter";
import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { CauseOfDeath } from "./PieceKilledEventHandler";
import { IBoardService } from "../../game-state/services/board/abstract/IBoardService";

export class PieceMovedEventHandler extends BaseEventHandler {
    private eventEmitter: GameEventEmitter;
    private piecesStorage: IPiecesStorage;
    private boardService: IBoardService;

    constructor(eventEmitter: GameEventEmitter, piecesStorage: IPiecesStorage, boardService: IBoardService) {
        super();
        this.eventEmitter = eventEmitter;
        this.piecesStorage = piecesStorage;
        this.boardService = boardService;
    }

    calculateMovementDistance(from: Position, to: Position): number {
        const dx = Math.abs(from.coordinates.x - to.coordinates.x);
        const dy = Math.abs(from.coordinates.y - to.coordinates.y);

        return dx + dy;
    }
    
    handleMove(piece: BasePiece, movedTo: Position) {
        piece.position = movedTo;
    }
    
    handleAttack(piece: BasePiece, attackedPiece: BasePiece) {
        attackedPiece.health.damage(1);
        piece.stats.damageDealt += 1;

        if (attackedPiece.health.isDead()) {
            piece.position = this.boardService.copyPosition(attackedPiece.position);
            piece.stats.kills += 1;
            attackedPiece.position = this.boardService.copyPosition(attackedPiece.position); // Trigger component render

            this.eventEmitter.emit(EventType.PIECE_KILLED, {
                killer: piece,
                victim: attackedPiece,
                causeOfDeath: CauseOfDeath.PLAYER,
            });
        }
    }

    handle(context: Record<string, any>): void {
        const piece: BasePiece = context['piece'];
        const movedTo: Position = context['to'];

        const movementDistance = this.calculateMovementDistance(piece.position, movedTo);
        piece.stats.tilesMoved += movementDistance;

        const piecesInTargetPosition = this.piecesStorage.getPieces((p) => isEqual(p.position, movedTo));
        if (piecesInTargetPosition.length === 0) {
            this.handleMove(piece, movedTo);
        } else {
            this.handleAttack(piece, piecesInTargetPosition[0]);
        }

        this.eventEmitter.emit(EventType.AFTER_PIECE_MOVED);
    }
}
