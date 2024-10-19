import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Square } from '../../model/types/Square';
import { isEqual } from 'lodash';
import { IValidator } from './abstract/IValidator';
import { IEditablePiecesStorage } from '../game-state/storages/pieces-storage/abstract/IEditablePiecesStorage';

export class PieceMoveValidator implements IValidator {
  private _draggedPiece: BasePiece;
  private _draggedToTarget: Square;
  private _piecesStorage: IEditablePiecesStorage;

  constructor(
    draggedPiece: BasePiece,
    draggedToTarget: Square,
    piecesStorage: IEditablePiecesStorage,
  ) {
    this._draggedPiece = draggedPiece;
    this._draggedToTarget = draggedToTarget;
    this._piecesStorage = piecesStorage;
  }

  validate(): boolean {
    if (this._draggedPiece === this._draggedToTarget) return false;
    if (this._draggedPiece.position?.boardId !== this._draggedToTarget.position?.boardId) return false;

    const legalMoves = this._draggedPiece.getLegalMoves(this._piecesStorage);
    return legalMoves.some((position) => isEqual(position, this._draggedToTarget.position));
  }
}
