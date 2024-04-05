import { game } from '../../Game';
import { comparePositions } from '../Utilities';
import { TriggerPieceOnItemAction } from '../actions/TriggerPieceOnItemAction';
import { Knight } from '../pieces/Knight';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { Position } from '../pieces/types/Position';
import { Validator } from './abstract/Validator';

export class PieceMovementSimulationValidator implements Validator {
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
        if (comparePositions(item.position, position)) {
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
    const deltaX = end.coordinates[0] - start.coordinates[0];
    const deltaY = end.coordinates[1] - start.coordinates[1];

    const xDirection = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
    const yDirection = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;

    const moveSteps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    for (let index = 1; index <= moveSteps; index++) {
      const x = start.coordinates[0] + index * xDirection;
      const y = start.coordinates[1] + index * yDirection;
      pathPositions.push({
        coordinates: [x, y],
        boardId: start.boardId,
      });
    }

    return pathPositions;
  }
}
