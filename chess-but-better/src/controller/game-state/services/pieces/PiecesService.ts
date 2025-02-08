import { isEqual } from "lodash";
import { BasePiece } from "../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../storages/pieces-storage/abstract/IPiecesStorage";
import { Position } from "../../../../model/piece/utilities/position/Position";
import { IPiecesService } from "./abstract/IPiecesService";
import { ITurnCounter } from "../../counters/turn-counter/abstract/ITurnCounter";

const ITEM_DOES_NOT_EXIST = -1;

export class PiecesService implements IPiecesService {
  private piecesStorage: IPiecesStorage;
  private turnCounter: ITurnCounter;

  constructor(piecesStorage: IPiecesStorage, turnCounter: ITurnCounter) {
    this.piecesStorage = piecesStorage;
    this.turnCounter = turnCounter;
  }

  getPieceByPosition(position: Position): BasePiece | undefined {
    const matchingPieces = this.piecesStorage.getPieces((piece) => isEqual(piece.position, position));
    return matchingPieces.length === 1 ? matchingPieces[0] : undefined;
  }

  isLegalMove(piece: BasePiece, to: Position): boolean {
    const currentPlayer = this.turnCounter.getCurrentPlayer();
    if (!isEqual(currentPlayer.team, piece.team)) return false;

    const legalMoves = piece.getLegalMoves(this.piecesStorage);
    return legalMoves.findIndex(position => isEqual(position, to)) !== ITEM_DOES_NOT_EXIST;
  }
}
