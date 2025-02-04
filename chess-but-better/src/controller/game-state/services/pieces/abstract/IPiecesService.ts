import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { Position } from "../../../../../model/piece/utilities/position/Position";

export interface IPiecesService {
    getPieceByPosition(position: Position): BasePiece | undefined;
    isLegalMove(piece: BasePiece, to: Position): boolean;
    copyPosition(position: Position): Position;
}
