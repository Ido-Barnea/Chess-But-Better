import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Pawn } from './Pawn';
import { Position } from './PiecesHelpers';

jest.mock('../GameController');
jest.mock('../Utilities.ts');
jest.mock('../PieceLogic.ts');

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);

describe('Piece movements', () => {
  test('Validating Pawn movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const pawn = new Pawn(initialPosition, whitePlayer);

    const singleStepMove: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const singleStepValidMove = pawn.validateMove({
      position: singleStepMove,
    });
    expect(singleStepValidMove).toEqual(singleStepMove);

    pawn.position = initialPosition;
    pawn.enPassantPosition = {
      coordinates: [1,6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const enPassantMove: Position = {
      coordinates: [1,5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const enPassantValidMove = pawn.validateMove({
      position: enPassantMove,
    });
    expect(enPassantValidMove).toEqual(enPassantMove);

    pawn.position = initialPosition;
    const twoStepsInitialMove: Position = {
      coordinates: [0, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const twoStepsInitialValidMove = pawn.validateMove({
      position: twoStepsInitialMove,
    });
    expect(twoStepsInitialValidMove).toEqual(twoStepsInitialMove);

    const diagonalAttackMove = new Pawn(
      {
        coordinates: [1, 5],
        boardId: OVERWORLD_BOARD_ID,
      },
      blackPlayer,
    );
    const diagonalAttackValidMove = pawn.validateMove(diagonalAttackMove);
    expect(diagonalAttackValidMove).toEqual(diagonalAttackMove.position);

    pawn.position = initialPosition;
    const invalidPosition: Position = {
      coordinates: [0, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const invalidMove = pawn.validateMove({ position: invalidPosition });
    expect(invalidMove).toEqual(initialPosition);
  });
});
