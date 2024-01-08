import { OVERWORLD_BOARD_ID } from '../Constants';
import { King } from './King';
import { Position } from './PiecesHelpers';
import { mockedLogic, whitePlayer } from './mocks';

jest.mock('../Logic', () => mockedLogic);

describe('Piece movements', () => {
  test('Validating King movement', () => {
    const initialPosition: Position = {
      coordinates: [4, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const king = new King(initialPosition, whitePlayer);

    const newStraightPosition: Position = {
      coordinates: [4, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validStraightMove = king.validateMove({
      position: newStraightPosition,
    });
    expect(validStraightMove).toEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 8],
      boardId: OVERWORLD_BOARD_ID,
    };
    const validDiagonalMove = king.validateMove({
      position: newDiagonalPosition,
    });
    expect(validDiagonalMove).toEqual(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const invalidMove = king.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});
