import { BaseBoard } from "../../../model/board/abstract/BaseBoard";
import { BoardType } from "../../../model/board/BoardTypes";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { Pieces, PieceType } from "../../pieces/types/Pieces";
import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { EventType } from "../Events";
import { GameEventEmitter } from "../GameEventEmitter";

export enum CauseOfDeath {
    PLAYER,
    ENVIRONMENT,
    GOD,
}

export class PieceKilledEventHandler extends BaseEventHandler {
    private eventEmitter: GameEventEmitter;
    private boards: Record<BoardType, BaseBoard>;

    private nextBoardSpecialPieces: Partial<Record<PieceType, BaseBoard>>;

    constructor(eventEmitter: GameEventEmitter, boards: Record<BoardType, BaseBoard>) {
        super();
        this.eventEmitter = eventEmitter;
        this.boards = boards;

        this.nextBoardSpecialPieces = {
            [Pieces.KING]: this.boards.hell,
        };
    }
    
    determinePieceNextBoard(piece: BasePiece, causeOfDeath: CauseOfDeath): BaseBoard {
        if (piece.resource.name in this.nextBoardSpecialPieces) {
            return this.nextBoardSpecialPieces[piece.resource.name]!;
        }

        const nextBoardType = piece.position.board.determineNextBoard(piece, causeOfDeath);
        return this.boards[nextBoardType];
    }

    handle(context: Record<string, any>): void {
        const piece: BasePiece = context['piece'];
        const causeOfDeath: CauseOfDeath = context['cause'];
        
        const nextBoard = this.determinePieceNextBoard(piece, causeOfDeath);
        piece.position.board = nextBoard;
        this.eventEmitter.emit(EventType.PIECE_SPAWNED, {piece});
    }
}
