import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Square } from '../../model/types/Square';
import { isEqual } from 'lodash';
import { IValidator } from './abstract/IValidator';
import { IPiecesStorage } from '../game state/storages/pieces storage/abstract/IPiecesStorage';

export class PieceMoveValidator implements IValidator {
  private _draggedPiece: BasePiece;
  private _draggedToTarget: Square;
  private piecesStorage: IPiecesStorage;

  constructor(
    draggedPiece: BasePiece,
    draggedToTarget: Square,
    piecesStorage: IPiecesStorage,
  ) {
    this._draggedPiece = draggedPiece;
    this._draggedToTarget = draggedToTarget;
    this.piecesStorage = piecesStorage;
  }

  validate(): boolean {
    if (this._draggedPiece === this._draggedToTarget) return false;
    if (
      this._draggedPiece.position?.boardId !==
      this._draggedToTarget.position?.boardId
    )
      return false;

    const legalMoves = this._draggedPiece.getLegalMoves(this.piecesStorage);
    return legalMoves.some((position) =>
      isEqual(position, this._draggedToTarget.position),
    );
  }
}
