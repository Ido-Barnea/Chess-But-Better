import { OVERWORLD_BOARD_ID } from '../../Constants';
import { Player } from '../game state/storages/players storage/Player';
import { game } from '../../Game';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { ItemActionResult } from './types/ItemActionResult';
import { Trap } from './Trap';
import { Position } from '../../../model/types/Position';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getAllSquareElements: jest.fn(),
  highlightLastMove: jest.fn(),
  spawnItemOnChildElement: jest.fn(),
  spawnItemElementOnBoard: jest.fn(),
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

describe('Trap', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS and add Trap to game items', () => {
    // Arrange
    const initialTrapPosition: Position = {
      coordinates: [6, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const trapItem = new Trap();

    // Act
    const itemActionResult = trapItem.use(initialTrapPosition);

    // Assert
    expect(itemActionResult).toEqual(ItemActionResult.SUCCESS);
    expect(game.getItems()).toContain(trapItem);
  });
});
