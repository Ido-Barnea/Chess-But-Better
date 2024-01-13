import { game } from '../../Game';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Queen } from './Queen';

jest.mock('../../ui/BoardManager.ts', () => ({}));
jest.mock('../../ui/Screen.ts', () => ({}));

const whitePlayer = new Player(PlayerColors.WHITE);

describe('Piece movements', () => {
  test('Validating Queen movement', () => {
    const initialPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const queen = new Queen(initialPosition, whitePlayer);
    game.setPieces([queen]);

    const newStraightPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = queen.getLegalMoves();
    expect(validMoves).toContainEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = queen.getLegalMoves();
    expect(validMoves).toContainEqual(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = queen.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});
