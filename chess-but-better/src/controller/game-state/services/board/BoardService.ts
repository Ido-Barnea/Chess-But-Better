import { isEqual } from "lodash";
import { BaseBoard } from "../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { IBoardService } from "./abstract/IBoardService";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { PiecesService } from "../pieces/PiecesService";

export class BoardService implements IBoardService {
  private piecesStorage: IPiecesStorage;
  private piecesService: PiecesService;

  constructor(piecesStorage: IPiecesStorage) {
    this.piecesStorage = piecesStorage;
    this.piecesService = new PiecesService(this.piecesStorage);
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

  movePiece(from: Position, to: Position) {
    const piece = this.piecesService.getPieceByPosition(from);
    if (!piece) return;
    if (!this.piecesService.isLegalMove(piece, to)) return;
    
    piece.position = to;
  }
}
