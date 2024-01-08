import { OVERWORLD_BOARD_ID } from '../Constants';
import { Position } from './PiecesHelpers';
import { Queen } from './Queen';
import { mockedLogic, whitePlayer } from './mocks';

jest.mock('./logic', () => mockedLogic);

describe('Piece movements', () => {
  test('Validating Queen movement', () => {
    const initialPosition: Position = {
      coordinates: [3, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const queen = new Queen(initialPosition, whitePlayer);

    const newStraightPosition: Position = {
      coordinates: [3, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validStraightMove = queen.validateMove({
      position: newStraightPosition,
    });
    expect(validStraightMove).toEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [6, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validDiagonalMove = queen.validateMove({
      position: newDiagonalPosition,
    });
    expect(validDiagonalMove).toEqual(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const invalidMove = queen.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});
