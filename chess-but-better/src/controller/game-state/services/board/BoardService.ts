import { isEqual } from "lodash";
import { BaseBoard } from "../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { IBoardService } from "./abstract/IBoardService";
import { Position } from "../../../../model/piece/utilities/position/Position";

const ITEM_DOES_NOT_EXIST = -1;

export class BoardService implements IBoardService {
  private piecesStorage: IPiecesStorage;

  constructor(piecesStorage: IPiecesStorage) {
    this.piecesStorage = piecesStorage;
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
    const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position, from));
    if (matchingPieces.length !== 1) return;

    const piece = matchingPieces[0];
    const legalMoves = piece.getLegalMoves(this.piecesStorage);
    if (legalMoves.findIndex(position => isEqual(position, to)) === ITEM_DOES_NOT_EXIST) return;
    
    piece.position = to;
  }
}
