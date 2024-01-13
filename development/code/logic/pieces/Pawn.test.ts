import { game } from '../../Game';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { Player, PlayerColors } from '../Players';
import { Pawn } from './Pawn';
import { Position } from './PiecesUtilities';

jest.mock('../../ui/BoardManager.ts', () => ({}));
jest.mock('../../ui/Screen.ts', () => ({}));

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);

describe('Piece movements', () => {
  test('Validating Pawn movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const pawn = new Pawn(initialPosition, whitePlayer);
    game.setPieces([pawn]);

    const singleStepMove: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = pawn.getLegalMoves();
    expect(validMoves).toContainEqual(singleStepMove);

    const blackPawnPosition: Position = {
      coordinates: [1, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const blackPawn = new Pawn(
      blackPawnPosition,
      blackPlayer,
    );
    blackPawn.enPassantPositions = [
      {
        coordinates: [1, 5],
        boardId: OVERWORLD_BOARD_ID,
      },
      {
        coordinates: [1, 6],
        boardId: OVERWORLD_BOARD_ID,
      },
    ];
    const pieces = game.getPieces();
    pieces.push(blackPawn);
    game.setPieces(pieces);

    const enPassantMove: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = pawn.getLegalMoves();
    expect(validMoves).toContainEqual(enPassantMove);

    blackPawn.position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = pawn.getLegalMoves();
    expect(validMoves).toContainEqual(blackPawn.position);

    const twoStepsInitialMove: Position = {
      coordinates: [0, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = pawn.getLegalMoves();
    expect(validMoves).toContainEqual(twoStepsInitialMove);

    const invalidPosition: Position = {
      coordinates: [0, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = pawn.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});
