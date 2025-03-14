import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { Position } from "../../../model/piece/utilities/position/Position";
import { EventType } from "../Events";
import { GameEventEmitter } from "../GameEventEmitter";
import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { CauseOfDeath } from "./PieceKilledEventHandler";
import { IBoardService } from "../../game-state/services/board/abstract/IBoardService";
import { IPiecesService } from "../../game-state/services/pieces/abstract/IPiecesService";
import { IItemsService } from "../../game-state/services/items/abstract/IItemsService";

export class PieceMovedEventHandler extends BaseEventHandler {
    private eventEmitter: GameEventEmitter;
    private piecesService: IPiecesService;
    private boardService: IBoardService;
    private itemsService: IItemsService;

    constructor(eventEmitter: GameEventEmitter, piecesService: IPiecesService, boardService: IBoardService, itemsService: IItemsService) {
        super();
        this.eventEmitter = eventEmitter;
        this.piecesService = piecesService;
        this.boardService = boardService;
        this.itemsService = itemsService;
    }

    calculateMovementDistance(from: Position, to: Position): number {
        const dx = Math.abs(from.coordinates.x - to.coordinates.x);
        const dy = Math.abs(from.coordinates.y - to.coordinates.y);

        return dx + dy;
    }
    
    handleMove(piece: BasePiece, movedTo: Position) {
        piece.position = movedTo;

        const itemInTargetPosition = this.itemsService.getItemByPosition(movedTo);
        if (itemInTargetPosition) {
            itemInTargetPosition.onTrigger(piece);
        }
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

        const pieceInTargetPosition = this.piecesService.getPieceByPosition(movedTo);
        if (!pieceInTargetPosition) {
            this.handleMove(piece, movedTo);
        } else {
            this.handleAttack(piece, pieceInTargetPosition);
        }

        this.eventEmitter.emit(EventType.AFTER_PIECE_MOVED);
    }
}
