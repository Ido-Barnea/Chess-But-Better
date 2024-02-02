import { game } from '../Game';
import { Piece } from './pieces/Pieces';
import { Position } from './pieces/PiecesUtilities';

export function comparePositions(
  firstPosition: Position | undefined,
  secondPosition: Position | undefined,
): boolean {
  if (!firstPosition|| !secondPosition) return false;

  const arePositionsEqual =
    firstPosition.coordinates[0] === secondPosition.coordinates[0] &&
    firstPosition.coordinates[1] === secondPosition.coordinates[1];
  const areBoardsEqual = firstPosition.boardId === secondPosition.boardId;

  return areBoardsEqual && arePositionsEqual;
}

export function getPieceByPosition(position: Position): Piece | undefined {
  return game.getPieces().find((piece) => {
    return comparePositions(position, piece.position);
  });
}

export function convertSquareIdToPosition(squareId: string): [number, number] {
  return squareId.split(',').map((coordinateString) => {
    return parseInt(coordinateString);
  }) as [number, number];
}
