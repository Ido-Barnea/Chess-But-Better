import { game } from '../../Game';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Knight } from './Knight';
import { Position } from './PiecesUtilities';

jest.mock('../../ui/BoardManager.ts', () => ({}));
jest.mock('../../ui/Screen.ts', () => ({}));

const whitePlayer = new Player(PlayerColors.WHITE);

describe('Piece movements', () => {
  test('Validating Knight movement', () => {
    const initialPosition: Position = {
      coordinates: [1, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const knight = new Knight(initialPosition, whitePlayer);
    game.setPieces([knight]);

    const newPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = knight.getLegalMoves();
    expect(validMoves).toContainEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = knight.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});
