import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Square } from '../../../model/types/Square';
import { isPlayerAllowedToAct } from '../PieceLogic';
import { comparePositions } from '../Utilities';
import { BaseItem } from '../items/abstract/Item';
import { Validator } from './abstract/Validator';

export class PlayerMoveValidator implements Validator {
  private _draggedPiece: BasePiece;
  private _draggedToTarget: BasePiece | Square | BaseItem;

  constructor(
    draggedPiece: BasePiece,
    draggedToTarget: BasePiece | Square | BaseItem,
  ) {
    this._draggedPiece = draggedPiece;
    this._draggedToTarget = draggedToTarget;
  }

  validate(): boolean {
    if (!isPlayerAllowedToAct(this._draggedPiece.player)) return false;
    if (this._draggedPiece === this._draggedToTarget) return false;
    if (
      this._draggedPiece.position?.boardId !==
      this._draggedToTarget.position?.boardId
    )
      return false;

    const legalMoves = this._draggedPiece.getLegalMoves();
    return legalMoves.some((position) =>
      comparePositions(position, this._draggedToTarget.position),
    );
  }
}
