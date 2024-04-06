import { OVERWORLD_BOARD_ID } from '../../Constants';
import { PiggyBank } from './PiggyBank';
import { Player } from '../players/Player';
import { onPlayerAction } from '../PieceLogic';
import { game } from '../../Game';
import { Rook } from '../pieces/Rook';
import { PlayerColor } from '../players/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Position } from '../pieces/types/Position';
import { Square } from '../pieces/types/Square';

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
  renderPlayersInformation: jest.fn(),
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

describe('Items test', () => {
  test('PiggyBank test', () => {
    const initialPiecePosition: Position = {
      coordinates: [4, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Rook(whitePlayer, initialPiecePosition);

    const itemPosition: Position = {
      coordinates: [2, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piggyBankItem = new PiggyBank(itemPosition);

    game.initialize();
    game.setItems([piggyBankItem]);
    game.setPieces([piece]);
    onPlayerAction(piece, piggyBankItem);

    const whitePlayerMoney = whitePlayer.gold;
    expect(whitePlayerMoney).toBeGreaterThan(0);

    const isPiggyBankThere = game.getItems().includes(piggyBankItem);
    expect(isPiggyBankThere).toBe(false);

    let newPieceCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).not.toEqual(initialPiecePosition.coordinates);

    const otherItemPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherPiggyBankItem = new PiggyBank(otherItemPosition);

    const targetSquarePosition: Position = {
      coordinates: [2, 1],
      boardId: OVERWORLD_BOARD_ID,
    };
    const targetSquare: Square = { position: targetSquarePosition };

    game.setItems([otherPiggyBankItem]);
    onPlayerAction(piece, targetSquare);

    const newWhitePlayerMoney = whitePlayer.gold;
    expect(newWhitePlayerMoney).toBeGreaterThan(whitePlayerMoney);

    const isOtherPiggyBankThere = game.getItems().includes(otherPiggyBankItem);
    expect(isOtherPiggyBankThere).toBe(false);

    newPieceCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).toEqual(targetSquarePosition.coordinates);
  });
});
