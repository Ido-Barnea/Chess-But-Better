import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Queen } from '../pieces/Queen';
import { PlayerColor } from '../players/types/PlayerColor';
import { Player } from '../players/Player';
import { Pawn } from '../pieces/Pawn';
import { Position } from '../pieces/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { AttackPieceAction } from '../actions/AttackPieceAction';
import { ActionResult } from '../actions/types/ActionResult';

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

describe('Friendly fire rule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS if killing a piece of the same color is valid', () => {
    // Arrange
    const initialKillerPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerPiece = new Queen(whitePlayer, initialKillerPiecePosition);

    const initialKilledPiecePosition: Position = {
      coordinates: [1, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialKilledPiecePosition);

    const attackTeammateAction = new AttackPieceAction(
      killerPiece,
      killedPiece,
    );

    // Act
    const actionResult = attackTeammateAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });
});
