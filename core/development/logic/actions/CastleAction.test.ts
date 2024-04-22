import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { King } from '../pieces/King';
import { Position } from '../pieces/types/Position';
import { Player } from '../players/Player';
import { PlayerColor } from '../players/types/PlayerColor';
import { CastleAction } from './CastleAction';
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

describe('CastleAction', () => {
  test('Invalid - Piece Undefined Position', () => {
    // Arrange
    const kingPiece = new King(whitePlayer, undefined);
    const targetPosition: Position = {
      coordinates: [6, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const castleAction = new CastleAction(kingPiece, targetPosition);

    // Act
    const actionResult = castleAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('Invalid - Piece Invalid Position', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    }
    const kingPiece = new King(whitePlayer, initialPosition);
    const targetPosition: Position = {
      coordinates: [5, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const castleAction = new CastleAction(kingPiece, targetPosition);

    // Act
    const actionResult = castleAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('Valid - Kingside Castling', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    }
    const kingPiece = new King(whitePlayer, initialPosition);
    const targetPosition: Position = {
      coordinates: [6, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const castleAction = new CastleAction(kingPiece, targetPosition);

    // Act
    const actionResult = castleAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });

  test('Valid - Queenside Castling', () => {
    // Arrange
    const initialPosition: Position = {
      coordinates: [4, 0],
      boardId: OVERWORLD_BOARD_ID,
    }
    const kingPiece = new King(whitePlayer, initialPosition);
    const targetPosition: Position = {
      coordinates: [2, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const castleAction = new CastleAction(kingPiece, targetPosition);

    // Act
    const actionResult = castleAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });
});
