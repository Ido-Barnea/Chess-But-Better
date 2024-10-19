import { Position } from '../../../model/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Pawn } from '../pieces/Pawn';
import { Player } from '../game-state/storages/players-storage/Player';
import { PlayerColor } from '../game-state/storages/players-storage/types/PlayerColor';
import { KillPieceByPieceAction } from './KillPieceByPieceAction';
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
game.setKillerPiece = jest.fn();

describe('KillPieceByPieceAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if killedPiece.health > 0', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const initialPieceHealth = 6;
    killedPiece.stats.health = initialPieceHealth;
    const killPieceByPieceAction = new KillPieceByPieceAction(
      killedPiece,
      killedPiece,
    );

    // Act
    const actionResult = killPieceByPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
    expect(killedPiece.stats.health).toEqual(initialPieceHealth - 1);
  });

  test('should return SUCCESS if killedPiece.health == 1', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const killPieceByPieceAction = new KillPieceByPieceAction(
      killedPiece,
      killedPiece,
    );

    // Act
    const actionResult = killPieceByPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(game.setKillerPiece).toHaveBeenCalledTimes(1);
  });
});
