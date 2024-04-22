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
import { BasePiece } from '../pieces/abstract/BasePiece';
import { BaseItem } from './abstract/Item';

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

let initialPiecePosition: Position;
let piece: BasePiece;
let piggyBankItem: BaseItem;

beforeEach(() => {
  initialPiecePosition = {
    coordinates: [3, 4],
    boardId: OVERWORLD_BOARD_ID,
  };
  piece = new Rook(whitePlayer, initialPiecePosition);

  const piggyBankPosition: Position = {
    coordinates: [1, 4],
    boardId: OVERWORLD_BOARD_ID,
  };
  piggyBankItem = new PiggyBank(piggyBankPosition);

  game.initialize();
  game.setItems([piggyBankItem]);
  game.setPieces([piece]);
});

describe('PiggyBank', () => {
  test('Collect PiggyBank Directly', () => {
    onPlayerAction(piece, piggyBankItem);

    expect(whitePlayer.gold).toBeGreaterThan(0);

    const isPiggyBankThere = game.getItems().includes(piggyBankItem);
    expect(isPiggyBankThere).toBe(false);

    const newPieceCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).not.toEqual(initialPiecePosition.coordinates);
  });

  test('Collect PiggyBank Indirectly', () => {
    const targetSquarePosition: Position = {
      coordinates: [0, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const targetSquare: Square = { position: targetSquarePosition };

    onPlayerAction(piece, targetSquare);

    expect(whitePlayer.gold).toBeGreaterThan(0);

    const doesPiggyBankExist = game.getItems().includes(piggyBankItem);
    expect(doesPiggyBankExist).toBe(false);

    const newPieceCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).toEqual(targetSquarePosition.coordinates);
  });
});
