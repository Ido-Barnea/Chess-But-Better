import { Position } from '../../types/Position';

export interface PieceBehavior {
  getLegalMoves(): Position[];
}
