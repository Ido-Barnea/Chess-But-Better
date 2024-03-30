import { Position } from '../types/Position';

export interface Piece {
  getLegalMoves(): Array<Position>;
}
