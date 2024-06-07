import { IPiecesStorage } from '../../../controller/game state/storages/pieces storage/abstract/IPiecesStorage';
import { Position } from '../../types/Position';

export interface PieceBehavior {
  getLegalMoves(piecesStorage: IPiecesStorage): Position[];
}
