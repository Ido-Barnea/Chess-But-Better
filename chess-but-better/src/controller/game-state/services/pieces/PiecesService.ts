import { isEqual } from "lodash";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { IPiecesService } from "./abstract/IPiecesService";

const ITEM_DOES_NOT_EXIST = -1;

export class PiecesService implements IPiecesService {
  private piecesStorage: IPiecesStorage;

  constructor(piecesStorage: IPiecesStorage) {
    this.piecesStorage = piecesStorage;
  }

  getPieceByPosition(position: Position): BasePiece | undefined {
    const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position, position));
    return matchingPieces.length === 1 ? matchingPieces[0] : undefined;
  }

  isLegalMove(piece: BasePiece, to: Position): boolean {
    const legalMoves = piece.getLegalMoves(this.piecesStorage);
    return legalMoves.findIndex(position => isEqual(position, to)) !== ITEM_DOES_NOT_EXIST;
  }

  copyPosition(position: Position): Position {
    return {
      coordinates: {
        x: position.coordinates.x,
        y: position.coordinates.y,
      },
      board: position.board,
    }
  }
}
