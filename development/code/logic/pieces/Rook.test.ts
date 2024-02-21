import { game } from '../../Game';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
  VOID_BOARD_ID,
} from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Rook } from './Rook';
import { Pawn } from './Pawn';
import { HELL_BOARD } from '../../ui/BoardManager';

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
  renderPlayersInformation: jest.fn(),
}));
jest.mock('../../ui/logs/Logger.ts');
jest.mock('../../ui/Events.ts', () => ({}));
jest.mock('../../ui/InventoriesUI.ts', () => ({
  initializeInventoryUI: jest.fn(),
  switchShownInventory: jest.fn(),
  showItemOnInventory: jest.fn(),
}));
jest.mock('../../ui/ShopUI.ts');

game.getCurrentPlayer = jest.fn().mockReturnValue(whitePlayer);

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
    let validMoves = rook.getLegalMoves();
    expect(validMoves).toContainEqual(newPosition);

    const invalidPosition: Position = {
      coordinates: [7, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = rook.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Rook killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerRook = new Rook(initialKillerPosition, whitePlayer);

    const initialVictimPosition: Position = {
      coordinates: [3, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const firstVictimPiece = new Pawn(
      {
        coordinates: initialVictimPosition.coordinates,
        boardId: initialVictimPosition.boardId,
      },
      blackPlayer,
    );

    game.initialize();

    game.setPieces([killerRook, firstVictimPiece]);
    onPlayerAction(killerRook, firstVictimPiece);

    let firstVictimPieceBoardId = firstVictimPiece.position.boardId;
    expect(firstVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerRook.position.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    let playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(0);

    const secondVictimPiece = new Pawn(
      {
        coordinates: initialKillerPosition.coordinates,
        boardId: initialKillerPosition.boardId,
      },
      blackPlayer,
    );
    secondVictimPiece.killCount = 1;
    game.setPieces([killerRook, secondVictimPiece]);
    onPlayerAction(killerRook, secondVictimPiece);

    const secondVictimPieceBoardId = secondVictimPiece.position.boardId;
    expect(secondVictimPieceBoardId).toEqual(HELL_BOARD_ID);

    killerNewCoordinates = killerRook.position.coordinates;
    expect(killerNewCoordinates).toEqual(initialKillerPosition.coordinates);

    playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(1);

    const thirdVictimPiece = new Pawn(
      {
        coordinates: initialVictimPosition.coordinates,
        boardId: initialVictimPosition.boardId,
      },
      blackPlayer,
    );
    game.setPieces([killerRook, firstVictimPiece, thirdVictimPiece]);
    onPlayerAction(killerRook, thirdVictimPiece);

    const thirdVictimPieceBoardId = thirdVictimPiece.position.boardId;
    expect(thirdVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    firstVictimPieceBoardId = firstVictimPiece.position.boardId;
    expect(firstVictimPieceBoardId).toEqual(VOID_BOARD_ID);

    killerNewCoordinates = killerRook.position.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(2);
  });
});
