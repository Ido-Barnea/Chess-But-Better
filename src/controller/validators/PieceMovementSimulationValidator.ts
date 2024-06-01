import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Position } from '../../model/types/Position';
import { game } from '../../Game';
import { isEqual } from 'lodash';
import { TriggerPieceOnItemAction } from '../actions/TriggerPieceOnItemAction';
import { Knight } from '../pieces/Knight';
import { IValidator } from './abstract/IValidator';

export class PieceMovementSimulationValidator implements IValidator {
  private _draggedPiece: BasePiece;
  private _targetPosition: Position;

  constructor(draggedPiece: BasePiece, targetPosition: Position) {
    this._draggedPiece = draggedPiece;
    this._targetPosition = targetPosition;
  }

  validate(): boolean {
    return this.simulatePath(this._draggedPiece, this._targetPosition);
  }

  simulatePath(piece: BasePiece, targetPosition: Position): boolean {
    const currentPosition = piece.position;
    if (!currentPosition) return false;

    const pieceBoard = piece.position?.boardId;
    const pathPositions =
      piece instanceof Knight
        ? [targetPosition]
        : this.getPathPositions(currentPosition, targetPosition);

    let wasMovementSuccessful = true;
    pathPositions.forEach((position) => {
      game.getItems().forEach((item) => {
        if (isEqual(item.position, position)) {
          new TriggerPieceOnItemAction(item, piece).execute();
          if (piece.position?.boardId !== pieceBoard) {
            wasMovementSuccessful = false;
          }
        }
      });
    });

    return wasMovementSuccessful;
  }

  getPathPositions(start: Position, end: Position): Array<Position> {
    const pathPositions: Array<Position> = [];
    const deltaX = end.coordinates.x - start.coordinates.x;
    const deltaY = end.coordinates.y - start.coordinates.y;

    const xDirection = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
    const yDirection = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;

    const moveSteps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    for (let index = 1; index <= moveSteps; index++) {
      pathPositions.push({
        coordinates: {
          x: start.coordinates.x + index * xDirection,
          y: start.coordinates.y + index * yDirection,
        },
        boardId: start.boardId,
      });
    }

    return pathPositions;
  }
}
