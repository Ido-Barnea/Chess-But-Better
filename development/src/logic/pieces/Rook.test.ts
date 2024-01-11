import { OVERWORLD_BOARD_ID } from '../Constants';
import { Game } from '../GameController';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesHelpers';
import { Rook } from './Rook';

jest.mock('../../LogicAdapter.ts');

let game: Game;
const whitePlayer = new Player(PlayerColors.WHITE);

beforeAll(() => {
  game = new Game();
});

describe('Piece movements', () => {
  test('Validating Rook movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const rook = new Rook(game, initialPosition, whitePlayer);

    const newPosition: Position = {
      coordinates: [0, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validMove = rook.validateMove({ position: newPosition });
    expect(validMove).toEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [7, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const invalidMove = rook.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});
