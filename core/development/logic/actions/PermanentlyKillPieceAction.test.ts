import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { King } from '../pieces/King';
import { Pawn } from '../pieces/Pawn';
import { Position } from '../pieces/types/Position';
import { Player } from '../players/Player';
import { PlayerColor } from '../players/types/PlayerColor';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
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
game.setPieces = jest.fn();
game.increaseDeathCounter = jest.fn();
game.end = jest.fn();

describe('KillPieceByPieceAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const permanentlyKillPieceAction = new PermanentlyKillPieceAction(
      killedPiece,
    );

    // Act
    const actionResult = permanentlyKillPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(game.setPieces).toHaveBeenCalledTimes(1);
    expect(game.increaseDeathCounter).toHaveBeenCalledTimes(1);
  });

  test('should end game if killedPiece is King', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new King(whitePlayer, initialPosition);
    const permanentlyKillPieceAction = new PermanentlyKillPieceAction(
      killedPiece,
    );

    // Act
    permanentlyKillPieceAction.execute();

    // Assert
    expect(game.end).toHaveBeenCalledTimes(1);
  });
});
