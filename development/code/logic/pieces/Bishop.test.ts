import { game } from '../../Game';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Bishop } from './Bishop';
import { Position } from './PiecesUtilities';

jest.mock('../../ui/BoardManager.ts', () => ({}));
jest.mock('../../ui/Screen.ts', () => ({}));

const whitePlayer = new Player(PlayerColors.WHITE);

describe('Piece movements', () => {
  test('Validating Bishop movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const bishop = new Bishop(initialPosition, whitePlayer);
    game.setPieces([bishop]);

    const newPosition: Position = {
      coordinates: [2, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = bishop.getLegalMoves();
    expect(validMoves).toContainEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = bishop.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});
