import { IPiecesStorage } from "../../../controller/storages/pieces-storage/abstract/IPiecesStorage";
import { Position } from "../utilities/position/Position";

export interface PieceBehavior {
  getLegalMoves(piecesStorage: IPiecesStorage): Array<Position>;
}
