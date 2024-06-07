import { OVERWORLD_BOARD_ID } from '../../Constants';
import { Player } from '../game state/storages/players storage/Player';
import { game } from '../../Game';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Pawn } from '../pieces/Pawn';
import { ItemActionResult } from './types/ItemActionResult';
import { PiggyBank } from './PiggyBank';
import { Position } from '../../../model/types/Position';

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

describe('PiggyBank', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS and increase the amount of gold the player has if position is valid', () => {
    // Arrange
    const initialPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Pawn(whitePlayer, initialPiecePosition);
    game.setPieces([piece]);

    const initialPlayerGold = whitePlayer.gold;

    const piggyBankItem = new PiggyBank();

    // Act
    const itemActionResult = piggyBankItem.use(initialPiecePosition);

    // Assert
    expect(itemActionResult).toEqual(ItemActionResult.SUCCESS);
    expect(piece.player.gold).toBeGreaterThan(initialPlayerGold);
  });

  test('should return FAILURE if piece is undefined', () => {
    // Arrange
    game.setPieces([]);
    const nonexistentPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };

    const piggyBankItem = new PiggyBank();

    // Act
    const itemActionResult = piggyBankItem.use(nonexistentPiecePosition);

    // Assert
    expect(itemActionResult).toEqual(ItemActionResult.FAILURE);
  });
});
