import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Rook } from './Rook';
import { Unicorn } from './Unicorn';

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
  test('Validating Unicorn movement', () => {
    const initialPosition: Position = {
      coordinates: [1, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const unicorn = new Unicorn(whitePlayer, initialPosition);
    game.setPieces([unicorn]);

    const validPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = unicorn.getLegalMoves();
    expect(validMoves).toContainEqual(validPosition);

    const invalidPosition: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = unicorn.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Unicorn killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPosition: Position = {
      coordinates: [1, 4],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerUnicorn = new Unicorn(whitePlayer, initialKillerPosition);
    const victimPiece = new Unicorn(blackPlayer, victimPosition);

    game.initialize();

    game.setPieces([killerUnicorn, victimPiece]);
    onPlayerAction(killerUnicorn, victimPiece);

    const victimPieceBoardId = victimPiece.position?.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerUnicorn.position?.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const othervictimPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherVictimPiece = new Rook(blackPlayer, othervictimPosition);
    killerUnicorn.position = initialKillerPosition;

    game.setPieces([killerUnicorn, otherVictimPiece]);
    onPlayerAction(killerUnicorn, otherVictimPiece);

    const otherVictimPieceBoardId = otherVictimPiece.position?.boardId;
    expect(otherVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    killerNewCoordinates = killerUnicorn.position.coordinates;
    expect(killerNewCoordinates).toEqual(othervictimPosition.coordinates);

    const playerXP = killerUnicorn.player.xp;
    expect(playerXP).toBeGreaterThan(0);

    const playerGold = killerUnicorn.player.gold;
    expect(playerGold).toBeGreaterThan(0);
  });
});
