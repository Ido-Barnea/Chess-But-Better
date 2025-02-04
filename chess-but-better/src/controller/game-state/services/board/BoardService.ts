import { isEqual } from "lodash";
import { BaseBoard } from "../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { IBoardService } from "./abstract/IBoardService";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { GameEventEmitter } from "../../../events/GameEventEmitter";
import { EventType } from "../../../events/Events";
import { IPiecesService } from "../pieces/abstract/IPiecesService";

export class BoardService implements IBoardService {
  private eventEmitter: GameEventEmitter;
  private piecesStorage: IPiecesStorage;
  private piecesService: IPiecesService;

  constructor(eventEmitter: GameEventEmitter, piecesStorage: IPiecesStorage, piecesService: IPiecesService) {
    this.eventEmitter = eventEmitter;
    this.piecesStorage = piecesStorage;
    this.piecesService = piecesService;
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

  getPieceAt(position: Position): BasePiece | undefined {
    const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position, position));
    return matchingPieces.length > 0 ? matchingPieces[0] : undefined;
  }

  movePiece(piece: BasePiece, to: Position) {
    if (!this.piecesService.isLegalMove(piece, to)) return;
    
    this.eventEmitter.emit(EventType.PIECE_MOVED, {piece, to});
    this.eventEmitter.emit(EventType.END_OF_TURN);
  }
}
