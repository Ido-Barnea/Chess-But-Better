import { OVERWORLD_BOARD_ID } from '../Constants';
import { Bishop } from './Bishop';
import { Position } from './PiecesHelpers';
import { mockedLogic, whitePlayer } from './mocks';

jest.mock('../Logic.ts', () => mockedLogic);

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
