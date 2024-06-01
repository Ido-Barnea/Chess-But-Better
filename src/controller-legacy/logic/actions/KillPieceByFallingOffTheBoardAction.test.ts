import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Pawn } from '../pieces/Pawn';
import { Player } from '../players/Player';
import { PlayerColor } from '../players/types/PlayerColor';
import { KillPieceByEnvironmentAction } from './KillPieceByEnvironmentAction';
import { KillPieceByFallingOffTheBoardAction } from './KillPieceByFallingOffTheBoardAction';
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

describe('KillPieceByFallingOffTheBoardAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if killedPiece.position is undefined', () => {
    // Arrange
    const killedPiece = new Pawn(whitePlayer, undefined);
    const killPieceByFallingOffTheBoardAction =
      new KillPieceByFallingOffTheBoardAction(killedPiece);

    // Act
    const actionResult = killPieceByFallingOffTheBoardAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('should call super.execute() if killedPiece.position exists', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const killPieceByFallingOffTheBoardAction =
      new KillPieceByFallingOffTheBoardAction(killedPiece);

    // Act
    const actionResult = killPieceByFallingOffTheBoardAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(KillPieceByEnvironmentAction).toHaveBeenCalledTimes(1);
  });
});
