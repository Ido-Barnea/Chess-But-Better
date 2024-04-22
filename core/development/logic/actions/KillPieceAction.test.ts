import { HEAVEN_BOARD_ID, HELL_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { King } from '../pieces/King';
import { Pawn } from '../pieces/Pawn';
import { Position } from '../pieces/types/Position';
import { Player } from '../players/Player';
import { PlayerColor } from '../players/types/PlayerColor';
import { KillPieceAction } from './KillPieceAction';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
import { SpawnPieceInHeavenAction } from './SpawnPieceInHeavenAction';
import { SpawnPieceInHellAction } from './SpawnPieceInHellAction';
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

jest.mock('./SpawnPieceInHellAction', () => ({
  __esModule: true,
  SpawnPieceInHellAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(1),
  })),
}));
jest.mock('./SpawnPieceInHeavenAction', () => ({
  __esModule: true,
  SpawnPieceInHeavenAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(1),
  })),
}));
jest.mock('./PermanentlyKillPieceAction', () => ({
  __esModule: true,
  PermanentlyKillPieceAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(1),
  })),
}));

describe('KillPieceAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should spawn piece in hell if killedPiece is on overworld board and is king', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new King(whitePlayer, initialPosition);
    const killPieceAction = new KillPieceAction(killedPiece, OVERWORLD_BOARD_ID);

    // Act
    const actionResult = killPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(SpawnPieceInHellAction).toHaveBeenCalledWith(killedPiece);
    expect(SpawnPieceInHellAction).toHaveBeenCalledTimes(1);
  });

  test('should spawn piece in hell if killedPiece is on overworld board and has killed another piece', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    killedPiece.killCount = 1;
    const killPieceAction = new KillPieceAction(killedPiece, OVERWORLD_BOARD_ID);

    // Act
    const actionResult = killPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(SpawnPieceInHellAction).toHaveBeenCalledWith(killedPiece);
    expect(SpawnPieceInHellAction).toHaveBeenCalledTimes(1);
  });

  test('should spawn piece in heaven if killedPiece is on overworld board and has not killed another piece', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const killPieceAction = new KillPieceAction(killedPiece, OVERWORLD_BOARD_ID);

    // Act
    const actionResult = killPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(SpawnPieceInHeavenAction).toHaveBeenCalledWith(killedPiece);
    expect(SpawnPieceInHeavenAction).toHaveBeenCalledTimes(1);
  });

  test('should permanently kill piece if killedPiece is on heaven board', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: HEAVEN_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const killPieceAction = new KillPieceAction(killedPiece, OVERWORLD_BOARD_ID);

    // Act
    const actionResult = killPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(PermanentlyKillPieceAction).toHaveBeenCalledWith(killedPiece);
    expect(PermanentlyKillPieceAction).toHaveBeenCalledTimes(1);
  });

  test('should permanently kill piece if killedPiece is on hell board', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: HELL_BOARD_ID,
    };
    const killedPiece = new Pawn(whitePlayer, initialPosition);
    const killPieceAction = new KillPieceAction(killedPiece, OVERWORLD_BOARD_ID);

    // Act
    const actionResult = killPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
    expect(PermanentlyKillPieceAction).toHaveBeenCalledWith(killedPiece);
    expect(PermanentlyKillPieceAction).toHaveBeenCalledTimes(1);
  });
});
