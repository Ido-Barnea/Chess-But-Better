import { OVERWORLD_BOARD_ID } from './constants';
import { Player, PlayerColors } from './players';
import { Position, Pawn, Bishop, Knight, Rook, Queen, King } from './pieces';

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);

function comparePositions(
  firstPosition: Position,
  secondPosition: Position,
): boolean {
  const arePositionsEqual =
    firstPosition.coordinates[0] === secondPosition.coordinates[0] &&
    firstPosition.coordinates[1] === secondPosition.coordinates[1];
  const areBoardsEqual = firstPosition.board === secondPosition.board;

  return areBoardsEqual && arePositionsEqual;
}

jest.mock('./logic', () => ({
  getCurrentPlayer: () => whitePlayer,
  switchIsCastling: jest.fn(),
  items: [],
  comparePositions: comparePositions,
  getPieceByPositionAndBoard: () => undefined,
}));

describe('Piece movements', () => {
  test('Validating Pawn movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 6],
      board: OVERWORLD_BOARD_ID,
    };
    const pawn = new Pawn(initialPosition, whitePlayer);

    const singleStepMove: Position = {
      coordinates: [0, 5],
      board: OVERWORLD_BOARD_ID,
    };
    const singleStepValidMove = pawn.validateMove({
      position: singleStepMove,
    });
    expect(singleStepValidMove).toEqual(singleStepMove);

    pawn.position = initialPosition;
    const twoStepsInitialMove: Position = {
      coordinates: [0, 4],
      board: OVERWORLD_BOARD_ID,
    };
    const twoStepsInitialValidMove = pawn.validateMove({
      position: twoStepsInitialMove,
    });
    expect(twoStepsInitialValidMove).toEqual(twoStepsInitialMove);

    const diagonalAttackMove = new Pawn(
      {
        coordinates: [1, 5],
        board: OVERWORLD_BOARD_ID,
      },
      blackPlayer,
    );
    const diagonalAttackValidMove = pawn.validateMove(diagonalAttackMove);
    expect(diagonalAttackValidMove).toEqual(diagonalAttackMove.position);
    
    pawn.position = initialPosition;
    const invalidPosition: Position = {
      coordinates: [0, 3],
      board: OVERWORLD_BOARD_ID,
    };
    const invalidMove = pawn.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });

  test('Validating Bishop movement', () => {
    const initialPosition: Position = {
      coordinates: [2, 7],
      board: OVERWORLD_BOARD_ID,
    };
    const bishop = new Bishop(initialPosition, whitePlayer);

    const newPosition: Position = {
      coordinates: [4, 5],
      board: OVERWORLD_BOARD_ID,
    };
    const validMove = bishop.validateMove({ position: newPosition });
    expect(validMove).toEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [2, 2],
      board: OVERWORLD_BOARD_ID,
    };
    const invalidMove = bishop.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });

  test('Validating Knight movement', () => {
    const initialPosition: Position = {
      coordinates: [1, 7],
      board: OVERWORLD_BOARD_ID,
    };
    const knight = new Knight(initialPosition, whitePlayer);

    const newPosition: Position = {
      coordinates: [2, 5],
      board: OVERWORLD_BOARD_ID,
    };
    const validMove = knight.validateMove({ position: newPosition });
    expect(validMove).toEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [1, 5],
      board: OVERWORLD_BOARD_ID,
    };
    const invalidMove = knight.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });

  test('Validating Rook movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 7],
      board: OVERWORLD_BOARD_ID,
    };
    const rook = new Rook(initialPosition, whitePlayer);

    const newPosition: Position = {
      coordinates: [7, 7],
      board: OVERWORLD_BOARD_ID,
    };
    const validMove = rook.validateMove({ position: newPosition });
    expect(validMove).toEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [1, 6],
      board: OVERWORLD_BOARD_ID,
    };
    const invalidMove = rook.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });

  test('Validating Queen movement', () => {
    const initialPosition: Position = {
      coordinates: [3, 7],
      board: OVERWORLD_BOARD_ID,
    };
    const queen = new Queen(initialPosition, whitePlayer);

    const newStraightPosition: Position = {
      coordinates: [3, 4],
      board: OVERWORLD_BOARD_ID,
    };
    const validStraightMove = queen.validateMove({
      position: newStraightPosition,
    });
    expect(validStraightMove).toEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [6, 4],
      board: OVERWORLD_BOARD_ID,
    };
    const validDiagonalMove = queen.validateMove({
      position: newDiagonalPosition,
    });
    expect(validDiagonalMove).toEqual(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      board: OVERWORLD_BOARD_ID,
    };
    const invalidMove = queen.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });

  test('Validating King movement', () => {
    const initialPosition: Position = {
      coordinates: [4, 7],
      board: OVERWORLD_BOARD_ID,
    };
    const king = new King(initialPosition, whitePlayer);

    const newStraightPosition: Position = {
      coordinates: [4, 6],
      board: OVERWORLD_BOARD_ID,
    };
    const validStraightMove = king.validateMove({
      position: newStraightPosition,
    });
    expect(validStraightMove).toEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 8],
      board: OVERWORLD_BOARD_ID,
    };
    const validDiagonalMove = king.validateMove({
      position: newDiagonalPosition,
    });
    expect(validDiagonalMove).toEqual(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      board: OVERWORLD_BOARD_ID,
    };
    const invalidMove = king.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});