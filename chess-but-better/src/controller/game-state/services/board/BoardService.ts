import { BaseBoard } from "../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IBoardService } from "./abstract/IBoardService";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { EventType } from "../../../events/Events";
import { BoardType } from "../../../../model/board/BoardTypes";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { IPiecesService } from "../pieces/abstract/IPiecesService";
import { GameEventEmitter } from "../../../events/GameEventEmitter";

export class BoardService implements IBoardService {
  private boards: Record<BoardType, BaseBoard>;
  private piecesStorage: IPiecesStorage;
  private piecesService: IPiecesService;
  private eventEmitter: GameEventEmitter;

  constructor(
    boards: Record<BoardType, BaseBoard>,
    piecesStorage: IPiecesStorage,
    piecesService: IPiecesService,
    eventEmitter: GameEventEmitter,
  ) {
    this.boards = boards;
    this.piecesStorage = piecesStorage;
    this.piecesService = piecesService;
    this.eventEmitter = eventEmitter;
  }

  getBoard(type: BoardType): BaseBoard {
    return this.boards[type];
  }

  retrievePopulatedBoards(): Array<BaseBoard> {
    return this.piecesStorage.getPieces()
            .map((piece) => piece.position.board)
            .reduce((uniqueBoards, board) => {
              if (!uniqueBoards.includes(board)) {
                uniqueBoards.push(board);
              }
              return uniqueBoards;
            }, [] as Array<BaseBoard>);
  }

  movePiece(piece: BasePiece, to: Position) {
    if (!this.piecesService.isLegalMove(piece, to)) return;
    
    this.eventEmitter.emit(EventType.PIECE_MOVED, {piece, to});
    this.eventEmitter.emit(EventType.END_OF_TURN);
  }

  copyPosition(position: Position): Position {
    return {
      coordinates: {
        x: position.coordinates.x,
        y: position.coordinates.y,
      },
      board: this.getBoard(position.board.name),
    }
  }
}
