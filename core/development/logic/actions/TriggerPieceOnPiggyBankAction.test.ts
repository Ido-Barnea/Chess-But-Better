import { Position } from '../../../model/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { PiggyBank } from '../items/PiggyBank';
import { Pawn } from '../pieces/Pawn';
import { Player } from '../players/Player';
import { PlayerColor } from '../players/types/PlayerColor';
import { TriggerPieceOnPiggyBankAction } from './TriggerPieceOnPiggyBankAction';
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

game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: jest.fn().mockReturnValue(whitePlayer),
  getTurnsCount: jest.fn().mockReturnValue(1),
});
game.setItems = jest.fn();

describe('TriggerPieceOnPiggyBankAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if piece.position is undefined', () => {
    // Arrange
    const itemPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const item = new PiggyBank(itemPosition);
    const piece = new Pawn(whitePlayer, undefined);
    const triggerPieceOnPiggyBankAction = new TriggerPieceOnPiggyBankAction(
      item,
      piece,
    );

    // Act
    const actionResult = triggerPieceOnPiggyBankAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('should return SUCCESS if piece.position is defined', () => {
    // Arrange
    const itemPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const item = new PiggyBank(itemPosition);
    const piece = new Pawn(whitePlayer, itemPosition);
    const triggerPieceOnPiggyBankAction = new TriggerPieceOnPiggyBankAction(
      item,
      piece,
    );

    // Act
    const actionResult = triggerPieceOnPiggyBankAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(game.setItems).toHaveBeenCalledTimes(1);
  });
});
