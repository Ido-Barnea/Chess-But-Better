import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { Player } from '../players/Player';
import { onPlayerAction } from '../PieceLogic';
import { game } from '../../Game';
import { Rook } from '../pieces/Rook';
import { Trap } from './Trap';
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

let initialPiecePosition: Position;
let piece: BasePiece;
let trapItem: BaseItem;

beforeEach(() => {
  initialPiecePosition = {
    coordinates: [3, 4],
    boardId: OVERWORLD_BOARD_ID,
  };
  piece = new Rook(whitePlayer, initialPiecePosition);

  const itemPosition: Position = {
    coordinates: [1, 4],
    boardId: OVERWORLD_BOARD_ID,
  };
  trapItem = new Trap(itemPosition);

  game.initialize();
  game.setItems([trapItem]);
  game.setPieces([piece]);
});

describe('Trap', () => {
  test('Trigger Trap Directly', () => {
    onPlayerAction(piece, trapItem);

    const pieceNewBoard = piece.position?.boardId;
    expect(pieceNewBoard).toEqual(HEAVEN_BOARD_ID);

    const isTrapThere = game.getItems().includes(trapItem);
    expect(isTrapThere).toBe(false);

    const newPieceCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).toEqual(trapItem.position?.coordinates);
  });

  test('Trigger Trap Indirectly', () => {
    const targetSquarePosition: Position = {
      coordinates: [0, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const targetSquare: Square = { position: targetSquarePosition };

    onPlayerAction(piece, targetSquare);

    expect(piece.position?.boardId).toEqual(HEAVEN_BOARD_ID);

    const doesTrapExist = game.getItems().includes(trapItem);
    expect(doesTrapExist).toBe(false);

    const newPieceCoordinates = piece.position?.coordinates;
    const trapCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).toEqual(trapCoordinates);
  });
});
