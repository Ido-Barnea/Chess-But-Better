import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Position } from '../../model/types/Position';
import { game } from '../Game';

export function comparePositions(
  firstPosition: Position | undefined,
  secondPosition: Position | undefined,
): boolean {
  if (!firstPosition || !secondPosition) return false;

  const arePositionsEqual =
    firstPosition.coordinates.x === secondPosition.coordinates.x &&
    firstPosition.coordinates.y === secondPosition.coordinates.y;
  const areBoardsEqual = firstPosition.boardId === secondPosition.boardId;

  return areBoardsEqual && arePositionsEqual;
}

export function getPieceByPosition(position: Position): BasePiece | undefined {
  return game.getPieces().find((piece) => {
    return comparePositions(position, piece.position);
  });
}

export function convertSquareIdToPosition(squareId: string): [number, number] {
  return squareId.split(',').map((coordinateString) => {
    return parseInt(coordinateString);
  }) as [number, number];
}
