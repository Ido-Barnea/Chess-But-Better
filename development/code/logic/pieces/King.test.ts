import { game } from '../../Game';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { King } from './King';
import { Position } from './PiecesUtilities';

jest.mock('../../ui/BoardManager.ts', () => ({}));
jest.mock('../../ui/Screen.ts', () => ({}));

const whitePlayer = new Player(PlayerColors.WHITE);

describe('Piece movements', () => {
  test('Validating King movement', () => {
    const initialPosition: Position = {
      coordinates: [4, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const king = new King(initialPosition, whitePlayer);
    game.setPieces([king]);

    const newStraightPosition: Position = {
      coordinates: [4, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = king.getValidMoves();
    expect(validMoves).toContain(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 8],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = king.getValidMoves();
    expect(validMoves).toContain(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = king.getValidMoves();
    expect(validMoves).not.toContain(invalidPosition);
  });
});
