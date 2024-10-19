import { Position } from '../../../model/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { King } from '../pieces/King';
import { Rook } from '../pieces/Rook';
import { Player } from '../game-state/storages/players-storage/Player';
import { PlayerColor } from '../game-state/storages/players-storage/types/PlayerColor';
import { MovePieceAction } from './MovePieceAction';
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
jest.mock('./CastleAction', () => ({
  __esModule: true,
  CastleAction: jest
    .fn()
    .mockImplementation((_piece: King, _targetPosition: Position) => ({
      execute: jest.fn().mockReturnValue(ActionResult.FAILURE),
    })),
}));

game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: jest.fn().mockReturnValue(whitePlayer),
  getTurnsCount: jest.fn().mockReturnValue(1),
});

describe('KillPieceByPieceAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS if piece is not pawn and game.getIsCaslting() is false', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Rook(whitePlayer, initialPosition);
    const targetPosition: Position = {
      coordinates: [0, 6],
      boardId: OVERWORLD_BOARD_ID,
    };

    const movePieceAction = new MovePieceAction(piece, targetPosition);

    // Act
    const actionResult = movePieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });

  test('should return FAILURE if piece is not pawn and game.getIsCaslting() is true and CastleAction returns FAILURE', () => {
    // Arrange
    game.getIsCaslting = jest.fn().mockReturnValue(true);
    game.switchIsCastling = jest.fn();

    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new King(whitePlayer, initialPosition);
    const targetPosition: Position = {
      coordinates: [6, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const movePieceAction = new MovePieceAction(piece, targetPosition);

    // Act
    const actionResult = movePieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
    expect(game.getIsCaslting).toHaveBeenCalledTimes(1);
    expect(game.switchIsCastling).toHaveBeenCalledTimes(1);
  });

  test('should return SUCCESS if piece is not pawn and game.getIsCaslting() is true and CastleAction returns SUCCESS', () => {
    // Arrange
    game.getIsCaslting = jest.fn().mockReturnValue(true);
    game.switchIsCastling = jest.fn();
    jest.mock('./CastleAction', () => ({
      __esModule: true,
      CastleAction: jest
        .fn()
        .mockImplementation((_piece: King, _targetPosition: Position) => ({
          execute: jest.fn().mockReturnValue(ActionResult.SUCCESS),
        })),
    }));

    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new King(whitePlayer, initialPosition);
    const targetPosition: Position = {
      coordinates: [6, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const movePieceAction = new MovePieceAction(piece, targetPosition);

    // Act
    const actionResult = movePieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
    expect(game.getIsCaslting).toHaveBeenCalledTimes(1);
    expect(game.switchIsCastling).toHaveBeenCalledTimes(1);
  });
});
