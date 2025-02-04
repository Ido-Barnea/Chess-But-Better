import { isEqual } from "lodash";
import { BaseBoard } from "../../../../model/board/abstract/BaseBoard";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { Coordinates } from "../../../../model/piece/utilities/position/Coordinates";
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

  getPieceAt(coordinates: Coordinates): BasePiece | undefined {
    const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position.coordinates, coordinates));
    return matchingPieces.length > 0 ? matchingPieces[0] : undefined;
  }

  movePiece(from: Coordinates, to: Coordinates) {
    const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position.coordinates, from));
    if (matchingPieces.length !== 1) return;

    const piece = matchingPieces[0];
    piece.position.coordinates = to;
  }
}
