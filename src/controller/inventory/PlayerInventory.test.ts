import { game } from '../../Game';
import { PlayerInventory } from './PlayerInventory';
import { Player } from '../game-state/storages/players-storage/Player';
import { PlayerColor } from '../game-state/storages/players-storage/types/PlayerColor';
import { INVENTORY_WIDTH } from '../../Constants';
import { Trap } from '../items/Trap';
import { InventoryActionResult } from './types/InventoryActionResult';
import { Shield } from '../items/Shield';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
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

game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: jest.fn().mockReturnValue(whitePlayer),
  getTurnsCount: jest.fn().mockReturnValue(1),
});

describe('PlayerInventory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getItems() should return an empty list', () => {
    // Arrange
    const inventory = new PlayerInventory();

    // Act
    const items = inventory.getItems();

    // Assert
    expect(items).toEqual([]);
  });

  test('addItem() should return SUCCESS if inventory is not full', () => {
    // Arrange
    const inventory = new PlayerInventory();
    const item = new Trap();

    // Act
    const inventoryActionResult = inventory.addItem(item);

    // Assert
    expect(inventoryActionResult).toEqual(InventoryActionResult.SUCCESS);
    expect(inventory.getItems()).toContain(item);
  });

  test('addItem() should return FAILURE if inventory is full', () => {
    // Arrange
    const inventory = new PlayerInventory();
    const bufferItem = new Trap();
    for (let i = 0; i < INVENTORY_WIDTH; i++) {
      inventory.addItem(bufferItem);
    }
    const item = new Shield();

    // Act
    const inventoryActionResult = inventory.addItem(item);

    // Assert
    expect(inventoryActionResult).toEqual(InventoryActionResult.FAILURE);
    expect(inventory.getItems()).not.toContain(item);
  });

  test('removeItem() should return FAILURE if item is not in inventory', () => {
    // Arrange
    const inventory = new PlayerInventory();
    const item = new Trap();

    // Act
    const inventoryActionResult = inventory.removeItem(item);

    // Assert
    expect(inventoryActionResult).toEqual(InventoryActionResult.FAILURE);
  });

  test('removeItem() should return SUCCESS if item is in inventory', () => {
    // Arrange
    const inventory = new PlayerInventory();
    const item = new Trap();
    inventory.addItem(item);

    // Act
    const inventoryActionResult = inventory.removeItem(item);

    // Assert
    expect(inventoryActionResult).toEqual(InventoryActionResult.SUCCESS);
    expect(inventory.getItems()).not.toContain(item);
  });
});
