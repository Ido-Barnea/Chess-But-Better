import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesHelpers';

export const whitePlayer = new Player(PlayerColors.WHITE);
export const blackPlayer = new Player(PlayerColors.BLACK);

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

export const mockedLogic = {
  getCurrentPlayer: () => whitePlayer,
  switchIsCastling: jest.fn(),
  items: [],
  comparePositions: comparePositions,
  getPieceByPositionAndBoard: () => undefined,
};