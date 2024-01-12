import { game } from '../../Game';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Rook } from './Rook';

jest.mock('../../ui/BoardManager.ts', () => ({}));
jest.mock('../../ui/Screen.ts', () => ({}));

const whitePlayer = new Player(PlayerColors.WHITE);

describe('Piece movements', () => {
  test('Validating Rook movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const rook = new Rook(initialPosition, whitePlayer);
    game.setPieces([rook]);

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
