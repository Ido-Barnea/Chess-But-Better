import { game } from '../../Game';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Bishop } from './Bishop';
import { Pawn } from './Pawn';
import { Position } from './PiecesUtilities';
import { HEAVEN_BOARD } from '../../ui/BoardManager';

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
  test('Validating Bishop movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const bishop = new Bishop(initialPosition, whitePlayer);
    game.setPieces([bishop]);

    const newPosition: Position = {
      coordinates: [2, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = bishop.getLegalMoves();
    expect(validMoves).toContainEqual(newPosition);

    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = bishop.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Bishop killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [1, 1],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPosition: Position = {
      coordinates: [5, 5],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerBishop = new Bishop(initialKillerPosition, whitePlayer);
    const victimPiece = new Pawn(victimPosition, blackPlayer);

    game.initialize();

    game.setPieces([killerBishop, victimPiece]);
    onPlayerAction(killerBishop, victimPiece);

    const victimPieceBoardId = victimPiece.position.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    const killerNewCoordinates = killerBishop.position.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const playerXP = killerBishop.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
