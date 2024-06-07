import { game } from '../../Game';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Queen } from '../pieces/Queen';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { Player } from '../game state/storages/players storage/Player';
import { Pawn } from '../pieces/Pawn';
import { OVERWORLD_BOARD_ID } from '../../Constants';
import { AttackPieceAction } from '../actions/AttackPieceAction';
import { Position } from '../../../model/types/Position';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());
const blackPlayer = new Player(PlayerColor.BLACK, new PlayerInventory());

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

describe('Experience On Kill Rule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return SUCCESS if xp gained from kill', () => {
    // Arrange
    const initialKillerPiecePosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerPiece = new Queen(whitePlayer, initialKillerPiecePosition);
    const initialKillerPlayerXp = killerPiece.player.xp;
    const initialKilledPiecePosition: Position = {
      coordinates: [1, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killedPiece = new Pawn(blackPlayer, initialKilledPiecePosition);

    const attackPieceAction = new AttackPieceAction(killerPiece, killedPiece);

    // Act
    attackPieceAction.execute();
    const newKillerPlayerXp = killerPiece.player.xp;

    // Assert
    expect(newKillerPlayerXp).toBeGreaterThan(initialKillerPlayerXp);
  });
});
