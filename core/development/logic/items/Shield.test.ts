import { OVERWORLD_BOARD_ID } from '../../Constants';
import { Player } from '../players/Player';
import { game } from '../../Game';
import { PlayerColor } from '../players/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Position } from '../pieces/types/Position';
import { Shield } from './Shield';
import { Pawn } from '../pieces/Pawn';
import { ItemActionResult } from './types/ItemActionResult';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getAllSquareElements: jest.fn(),
  highlightLastMove: jest.fn(),
  spawnItemOnChildElement: jest.fn(),
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

game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: jest.fn().mockReturnValue(whitePlayer),
  getTurnsCount: jest.fn().mockReturnValue(1),
});

describe('Shield', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS and increase piece health if position is valid', () => {
    // Arrange
    const initialPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Pawn(whitePlayer, initialPiecePosition);
    const initialPieceHealth = piece.health;
    game.setPieces([piece]);

    const shieldItem = new Shield();

    // Act
    const itemActionResult = shieldItem.use(initialPiecePosition);

    // Assert
    expect(itemActionResult).toEqual(ItemActionResult.SUCCESS);
    expect(piece.health).toEqual(initialPieceHealth + 1);
  });

  test('should return FAILURE if piece is undefined', () => {
    // Arrange
    game.setPieces([]);
    const nonexistentPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const shieldItem = new Shield();

    // Act
    const itemActionResult = shieldItem.use(nonexistentPiecePosition);

    // Assert
    expect(itemActionResult).toEqual(ItemActionResult.FAILURE);
  });

  test('should return FAILURE if piece.position is undefined', () => {
    // Arrange
    const piece = new Pawn(whitePlayer, undefined);
    game.setPieces([piece]);
    const initialPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const shieldItem = new Shield();

    // Act
    const itemActionResult = shieldItem.use(initialPiecePosition);

    // Assert
    expect(itemActionResult).toEqual(ItemActionResult.FAILURE);
  });
});
