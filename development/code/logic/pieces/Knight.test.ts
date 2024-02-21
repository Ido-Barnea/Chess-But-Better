import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Knight } from './Knight';
import { Position } from './PiecesUtilities';
import { Rook } from './Rook';

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
  test('Validating Knight movement', () => {
    const initialPosition: Position = {
      coordinates: [1, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const knight = new Knight(initialPosition, whitePlayer);
    game.setPieces([knight]);

    const newPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = knight.getLegalMoves();
    expect(validMoves).toContainEqual(newPosition);

    const invalidPosition: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = knight.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Knight killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPosition: Position = {
      coordinates: [1, 4],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerKnight = new Knight(initialKillerPosition, whitePlayer);
    const victimPiece = new Knight(victimPosition, blackPlayer);

    game.initialize();

    game.setPieces([killerKnight, victimPiece]);
    onPlayerAction(killerKnight, victimPiece);

    const victimPieceBoardId = victimPiece.position.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerKnight.position.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const othervictimPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherVictimPiece = new Rook(othervictimPosition, blackPlayer);
    killerKnight.position = initialKillerPosition;

    game.setPieces([killerKnight, otherVictimPiece]);
    onPlayerAction(killerKnight, otherVictimPiece);

    const otherVictimPieceBoardId = otherVictimPiece.position.boardId;
    expect(otherVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    killerNewCoordinates = killerKnight.position.coordinates;
    expect(killerNewCoordinates).toEqual(othervictimPosition.coordinates);

    const playerXP = killerKnight.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
