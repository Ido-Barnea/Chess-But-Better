import { BaseBoard } from "../../../../model/board/abstract/BaseBoard";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { IBoardService } from "./abstract/IBoardService";

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
}
