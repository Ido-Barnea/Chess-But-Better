import { Position } from '../PiecesUtilities';

export interface Piece {
    getLegalMoves(): Array<Position>;
}
