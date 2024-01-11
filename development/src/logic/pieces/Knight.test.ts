import { OVERWORLD_BOARD_ID } from '../Constants';
import { Game } from '../GameController';
import { Player, PlayerColors } from '../Players';
import { Knight } from './Knight';
import { Position } from './PiecesHelpers';

jest.mock('../../LogicAdapter.ts');

let game: Game;
const whitePlayer = new Player(PlayerColors.WHITE);

beforeAll(() => {
  game = new Game();
});

describe('Piece movements', () => {
  test('Validating Knight movement', () => {
    const initialPosition: Position = {
      coordinates: [1, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const knight = new Knight(game, initialPosition, whitePlayer);

    const newPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validMove = knight.validateMove({ position: newPosition });
    expect(validMove).toEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const invalidMove = knight.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});
