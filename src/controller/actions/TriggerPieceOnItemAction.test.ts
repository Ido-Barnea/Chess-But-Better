import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { PiggyBank } from '../items/PiggyBank';
import { Trap } from '../items/Trap';
import { Pawn } from '../pieces/Pawn';
import { Player } from '../game-state/storages/players-storage/Player';
import { PlayerColor } from '../game-state/storages/players-storage/types/PlayerColor';
import { TriggerPieceOnItemAction } from './TriggerPieceOnItemAction';
import { TriggerPieceOnPiggyBankAction } from './TriggerPieceOnPiggyBankAction';
import { TriggerPieceOnTrapAction } from './TriggerPieceOnTrapAction';
import { ActionResult } from './types/ActionResult';

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
jest.mock('./TriggerPieceOnPiggyBankAction', () => ({
  __esModule: true,
  TriggerPieceOnPiggyBankAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(ActionResult.SUCCESS),
  })),
}));
jest.mock('./TriggerPieceOnTrapAction', () => ({
  __esModule: true,
  TriggerPieceOnTrapAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(ActionResult.SUCCESS),
  })),
}));

game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: jest.fn().mockReturnValue(whitePlayer),
  getTurnsCount: jest.fn().mockReturnValue(1),
});

describe('TriggerPieceOnItemAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if item.name is not found', () => {
    // Arrange
    const item = new PiggyBank(undefined);
    item.name = '';
    const piece = new Pawn(whitePlayer, undefined);
    const triggerPieceOnItemAction = new TriggerPieceOnItemAction(item, piece);

    // Act
    const actionResult = triggerPieceOnItemAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('should return SUCCESS and call TriggerPieceOnPiggyBankAction', () => {
    // Arrange
    const item = new PiggyBank(undefined);
    const piece = new Pawn(whitePlayer, undefined);
    const triggerPieceOnItemAction = new TriggerPieceOnItemAction(item, piece);

    // Act
    const actionResult = triggerPieceOnItemAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(TriggerPieceOnPiggyBankAction).toHaveBeenCalledTimes(1);
  });

  test('should return SUCCESS and call TriggerPieceOnTrapAction', () => {
    // Arrange
    const item = new Trap(undefined);
    const piece = new Pawn(whitePlayer, undefined);
    const triggerPieceOnItemAction = new TriggerPieceOnItemAction(item, piece);

    // Act
    const actionResult = triggerPieceOnItemAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(TriggerPieceOnTrapAction).toHaveBeenCalledTimes(1);
  });
});
