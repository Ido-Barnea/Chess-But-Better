import { Position } from '../pieces/PiecesHelpers';

export function comparePositions(
  firstPosition: Position,
  secondPosition: Position,
): boolean {
  const arePositionsEqual =
    firstPosition.coordinates[0] === secondPosition.coordinates[0] &&
    firstPosition.coordinates[1] === secondPosition.coordinates[1];
  const areBoardsEqual = firstPosition.boardId === secondPosition.boardId;

  return areBoardsEqual && arePositionsEqual;
}

export function getPieceByPosition() {
  return undefined;
};
