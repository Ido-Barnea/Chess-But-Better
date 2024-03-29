import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player } from '../players/Player';
import { Bishop } from './Bishop';
import { Pawn } from './Pawn';
import { Position } from './PiecesUtilities';
import { PlayerColor } from '../players/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';

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
    const bishop = new Bishop(whitePlayer, initialPosition);
    game.setPieces([bishop]);

    const validPosition: Position = {
      coordinates: [2, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = bishop.getLegalMoves();
    expect(validMoves).toContainEqual(validPosition);

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

    const killerBishop = new Bishop(whitePlayer, initialKillerPosition);
    const victimPiece = new Pawn(blackPlayer, victimPosition);

    game.initialize();

    game.setPieces([killerBishop, victimPiece]);
    onPlayerAction(killerBishop, victimPiece);

    const victimPieceBoardId = victimPiece.position?.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    const killerNewCoordinates = killerBishop.position?.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const playerXP = killerBishop.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
