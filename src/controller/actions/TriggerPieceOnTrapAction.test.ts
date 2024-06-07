import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Trap } from '../items/Trap';
import { Pawn } from '../pieces/Pawn';
import { Player } from '../game state/storages/players storage/Player';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { KillPieceByEnvironmentAction } from './KillPieceByEnvironmentAction';
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

game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: jest.fn().mockReturnValue(whitePlayer),
  getTurnsCount: jest.fn().mockReturnValue(1),
});
game.setItems = jest.fn();
game.endMove = jest.fn();

jest.mock('./KillPieceByEnvironmentAction', () => ({
  __esModule: true,
  KillPieceByEnvironmentAction: jest
    .fn()
    .mockImplementation((killedPiece: BasePiece) => ({
      execute: jest
        .fn()
        .mockReturnValue(
          killedPiece.position ? ActionResult.SUCCESS : ActionResult.FAILURE,
        ),
    })),
}));

describe('TriggerPieceOnTrapAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if item.position is undefined', () => {
    // Arrange
    const item = new Trap(undefined);
    const piece = new Pawn(whitePlayer, undefined);
    const triggerPieceOnTrapAction = new TriggerPieceOnTrapAction(item, piece);

    // Act
    const actionResult = triggerPieceOnTrapAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('should return SUCCESS if item.position is defined', () => {
    // Arrange
    const itemPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const item = new Trap(itemPosition);
    const piece = new Pawn(whitePlayer, itemPosition);
    const triggerPieceOnTrapAction = new TriggerPieceOnTrapAction(item, piece);

    // Act
    const actionResult = triggerPieceOnTrapAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(game.setItems).toHaveBeenCalledTimes(1);
    expect(game.endMove).toHaveBeenCalledTimes(1);
    expect(KillPieceByEnvironmentAction).toHaveBeenCalledTimes(1);
  });
});
