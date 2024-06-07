import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Pawn } from '../pieces/Pawn';
import { Player } from '../game state/storages/players storage/Player';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { KillPieceByEnvironmentAction } from './KillPieceByEnvironmentAction';
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
game.endMove = jest.fn();

describe('KillPieceByEnvironmentAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS', () => {
    // Arrange
    const killedPiece = new Pawn(whitePlayer, undefined);
    const killPieceByEnvironmentAction = new KillPieceByEnvironmentAction(
      killedPiece,
      'cause',
      killedPiece.position?.boardId,
    );

    // Act
    const actionResult = killPieceByEnvironmentAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });
});
