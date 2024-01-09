import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Bishop } from './Bishop';
import { Position } from './PiecesHelpers';

jest.mock('../Logic.ts');

const whitePlayer = new Player(PlayerColors.WHITE);

describe('Piece movements', () => {
  test('Validating Bishop movement', () => {
    const initialPosition: Position = {
      coordinates: [2, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const bishop = new Bishop(initialPosition, whitePlayer);

    const newPosition: Position = {
      coordinates: [4, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validMove = bishop.validateMove({ position: newPosition });
    expect(validMove).toEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const invalidMove = bishop.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});
