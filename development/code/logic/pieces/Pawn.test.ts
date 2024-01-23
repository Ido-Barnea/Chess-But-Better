import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Pawn } from './Pawn';
import { Position, Square } from './PiecesUtilities';

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
  getAllSquareElements: jest.fn(),
  highlightLastMove: jest.fn(),
}));
jest.mock('../../ui/Screen.ts', () => ({
  renderNewRule: jest.fn(),
  renderPlayersInformation: jest.fn(),
}));
jest.mock('../../ui/Logger.ts');
jest.mock('../../ui/Events.ts', () => ({}));

game.getCurrentPlayer = jest.fn().mockReturnValue(whitePlayer);

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
    blackPawn.possibleEnPassantPositions = [
      {
        coordinates: [1, 5],
        boardId: OVERWORLD_BOARD_ID,
      },
      {
        coordinates: [1, 6],
        boardId: OVERWORLD_BOARD_ID,
      },
    ];
    blackPawn.isInitialDoubleStep = true;
    
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

describe('Piece killing', () => {
  test ('Validating Pawn killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [4, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerPawn = new Pawn(initialKillerPosition, whitePlayer);

    const victimPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPiece = new Pawn(victimPosition, blackPlayer);

    game.initialize();
    game.setPieces([killerPawn, victimPiece]);
    onPlayerAction(killerPawn, victimPiece);
    
    const victimPieceBoardId = victimPiece.position.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);
    
    let killerNewCoordinates = killerPawn.position.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    // Killer position is now 3, 3
    const enPassantVictimPosition: Position = {
      coordinates: [2, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const enPassantPawn = new Pawn(enPassantVictimPosition, blackPlayer);
    enPassantPawn.possibleEnPassantPositions = [
      {
        coordinates: [2, 2],
        boardId: OVERWORLD_BOARD_ID,
      },
      {
        coordinates: [2, 3],
        boardId: OVERWORLD_BOARD_ID,
      },
    ];
    enPassantPawn.isInitialDoubleStep = true;

    // The square that the killer moves to
    const enPassantAttackSquare = enPassantPawn.possibleEnPassantPositions[0];
    const enPassantSquare: Square = { position: enPassantAttackSquare };    
    
    game.setPieces([killerPawn, enPassantPawn]);
    onPlayerAction(killerPawn, enPassantSquare);

    const enPassantPawnBoardId = enPassantPawn.position.boardId;
    expect(enPassantPawnBoardId).toEqual(HEAVEN_BOARD_ID);
    
    killerNewCoordinates = killerPawn.position.coordinates;
    expect(killerNewCoordinates).toEqual(enPassantAttackSquare.coordinates);

    const playerXP = killerPawn.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});

