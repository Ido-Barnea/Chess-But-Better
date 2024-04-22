import { OVERWORLD_BOARD_ID, VOID_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Pawn } from '../pieces/Pawn';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { Position } from '../pieces/types/Position';
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

const getCurrentPlayerMock = jest.fn().mockReturnValue(whitePlayer);
const getTurnsCount = jest.fn().mockReturnValue(1);
game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: getCurrentPlayerMock,
  getTurnsCount: getTurnsCount,
});

jest.mock('./KillPieceByEnvironmentAction', () => ({
  __esModule: true,
  KillPieceByEnvironmentAction: jest.fn().mockImplementation((killedPiece: BasePiece) => ({
    execute: jest.fn().mockReturnValueOnce(killedPiece.position ? ActionResult.SUCCESS : ActionResult.FAILURE),
  })),
}));

describe('KillPieceByFallingOffTheBoardAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if killedPiece.position is undefined', () => {
    // Arrange
    const killedPiece = new Pawn(whitePlayer, undefined);
    const killPieceByFallingOffTheBoardAction = new KillPieceByFallingOffTheBoardAction(killedPiece);

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
    const killPieceByFallingOffTheBoardAction = new KillPieceByFallingOffTheBoardAction(killedPiece);

    // Act
    const actionResult = killPieceByFallingOffTheBoardAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(KillPieceByEnvironmentAction).toHaveBeenCalledTimes(1);
  });
});
