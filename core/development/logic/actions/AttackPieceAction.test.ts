import { Position } from '../../../model/types/Position';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Queen } from '../pieces/Queen';
import { Player } from '../players/Player';
import { PlayerColor } from '../players/types/PlayerColor';
import { AttackPieceAction } from './AttackPieceAction';
import { ActionResult } from './types/ActionResult';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());
const blackPlayer = new Player(PlayerColor.BLACK, new PlayerInventory());

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

describe('AttackPieceAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return FAILURE if piece is undefined', () => {
    // Arrange
    const piece = new Queen(whitePlayer, undefined);

    const attackPieceAction = new AttackPieceAction(piece, piece);

    // Act
    const actionResult = attackPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.FAILURE);
  });

  test('should return SUCCESS if valid kill action', () => {
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
    const killedPiece = new Queen(blackPlayer, initialKilledPiecePosition);

    const attackPieceAction = new AttackPieceAction(killerPiece, killedPiece);

    // Act
    const actionResult = attackPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });

  test('should return SUCCESS if valid self attack', () => {
    // Arrange
    const initialPiecePosition: Position = {
      coordinates: [3, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Queen(whitePlayer, initialPiecePosition);

    const attackPieceAction = new AttackPieceAction(piece, piece);

    // Act
    const actionResult = attackPieceAction.execute();

    // Assert
    expect(actionResult).toEqual(ActionResult.SUCCESS);
  });
});
