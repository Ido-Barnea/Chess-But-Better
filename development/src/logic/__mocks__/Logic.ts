import { Player, PlayerColors } from '../Players';
import { Position } from '../pieces/PiecesHelpers';

export const whitePlayer = new Player(PlayerColors.WHITE);
export const items = [];

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

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function switchIsCastling() {}

export function getPieceByPositionAndBoard() {
  return undefined;
};

export function getCurrentPlayer() {
  return whitePlayer;
}
