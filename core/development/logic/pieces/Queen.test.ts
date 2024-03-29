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
import { Queen } from './Queen';
import { Pawn } from './Pawn';

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
  hideUnicornAttackButton: jest.fn(),
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
  test('Validating Queen movement', () => {
    const initialPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const queen = new Queen(whitePlayer, initialPosition);
    game.setPieces([queen]);

    const newStraightPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = queen.getLegalMoves();
    expect(validMoves).toContainEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = queen.getLegalMoves();
    expect(validMoves).toContainEqual(newDiagonalPosition);

    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = queen.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Queen killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const initialVictimPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerQueen = new Queen(whitePlayer, initialKillerPosition);
    const firstVictimPiece = new Pawn(blackPlayer, {
      coordinates: initialVictimPosition.coordinates,
      boardId: initialVictimPosition.boardId,
    });

    game.initialize();

    game.setPieces([killerQueen, firstVictimPiece]);
    onPlayerAction(killerQueen, firstVictimPiece);

    const firstVictimPieceBoardId = firstVictimPiece.position?.boardId;
    expect(firstVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerQueen.position?.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    // Diagonal kill
    const diagonalVictimPosition: Position = {
      coordinates: [3, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const diagonlaVictimPiece = new Pawn(blackPlayer, diagonalVictimPosition);

    game.setPieces([killerQueen, diagonlaVictimPiece]);
    onPlayerAction(killerQueen, diagonlaVictimPiece);

    killerNewCoordinates = killerQueen.position?.coordinates;
    expect(killerNewCoordinates).toEqual(diagonalVictimPosition.coordinates);

    const playerXP = killerQueen.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
