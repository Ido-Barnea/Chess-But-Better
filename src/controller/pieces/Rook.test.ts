import { game } from '../../Game';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player } from '../game-state/storages/players-storage/Player';
import { Rook } from './Rook';
import { Pawn } from './Pawn';
import { PlayerColor } from '../game-state/storages/players-storage/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Position } from '../../../model/types/Position';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());
const blackPlayer = new Player(PlayerColor.BLACK, new PlayerInventory());

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
  getAllSquareElements: jest.fn(),
  highlightLastMove: jest.fn(),
}));
jest.mock('../../ui/Screen.ts', () => ({
  renderGameInformation: jest.fn(),
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

const getCurrentPlayerMock = jest.fn().mockReturnValue(whitePlayer);
const getTurnsCount = jest.fn().mockReturnValue(1);
game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: getCurrentPlayerMock,
  getTurnsCount: getTurnsCount,
});

describe('Piece movements', () => {
  test('Validating Rook movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const rook = new Rook(whitePlayer, initialPosition);
    game.setPieces([rook]);

    const validPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = rook.getLegalMoves();
    expect(validMoves).toContainEqual(validPosition);

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
    const killerRook = new Rook(whitePlayer, initialKillerPosition);

    const initialVictimPosition: Position = {
      coordinates: [3, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const firstVictimPiece = new Pawn(blackPlayer, {
      coordinates: initialVictimPosition.coordinates,
      boardId: initialVictimPosition.boardId,
    });

    game.initialize();

    game.setPieces([killerRook, firstVictimPiece]);
    onPlayerAction(killerRook, firstVictimPiece);

    const firstVictimPieceBoardId = firstVictimPiece.position?.boardId;
    expect(firstVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerRook.position?.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    let playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(0);

    const secondVictimPiece = new Pawn(blackPlayer, {
      coordinates: initialKillerPosition.coordinates,
      boardId: initialKillerPosition.boardId,
    });
    secondVictimPiece.modifiers.killCount = 1;
    game.setPieces([killerRook, secondVictimPiece]);
    onPlayerAction(killerRook, secondVictimPiece);

    const secondVictimPieceBoardId = secondVictimPiece.position?.boardId;
    expect(secondVictimPieceBoardId).toEqual(HELL_BOARD_ID);

    killerNewCoordinates = killerRook.position?.coordinates;
    expect(killerNewCoordinates).toEqual(initialKillerPosition.coordinates);

    playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(1);

    expect(killerRook.position).toBeDefined();
    if (!killerRook.position) return;
    killerRook.position.boardId = HEAVEN_BOARD_ID;
    const thirdVictimPiece = new Pawn(blackPlayer, {
      coordinates: initialVictimPosition.coordinates,
      boardId: HEAVEN_BOARD_ID,
    });
    game.setPieces([killerRook, thirdVictimPiece]);
    onPlayerAction(killerRook, thirdVictimPiece);

    expect(thirdVictimPiece.position).toBeUndefined();

    killerNewCoordinates = killerRook.position?.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(2);
  });
});
