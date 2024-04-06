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
  test('Trap test', () => {
    const initialPiecePosition: Position = {
      coordinates: [3, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Rook(whitePlayer, initialPiecePosition);

    const itemPosition: Position = {
      coordinates: [2, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const trapItem = new Trap(itemPosition);

    game.initialize();
    game.setItems([trapItem]);
    game.setPieces([piece]);
    onPlayerAction(piece, trapItem);

    const pieceNewBoard = piece.position?.boardId;
    expect(pieceNewBoard).toEqual(HEAVEN_BOARD_ID);

    const isTrapThere = game.getItems().includes(trapItem);
    expect(isTrapThere).toBe(false);

    const newPieceCoordinates = piece.position?.coordinates;
    expect(newPieceCoordinates).toEqual(itemPosition.coordinates);

    const initialOtherPiecePosition: Position = {
      coordinates: [2, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherPiece = new Rook(whitePlayer, initialOtherPiecePosition);

    const otherItemPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherTrapItem = new Trap(otherItemPosition);

    const targetSquarePosition: Position = {
      coordinates: [2, 1],
      boardId: OVERWORLD_BOARD_ID,
    };
    const targetSquare: Square = { position: targetSquarePosition };

    game.setItems([otherTrapItem]);
    onPlayerAction(otherPiece, targetSquare);

    const otherPieceNewBoard = otherPiece.position?.boardId;
    expect(otherPieceNewBoard).toEqual(HEAVEN_BOARD_ID);

    const isOtherTrapThere = game.getItems().includes(trapItem);
    expect(isOtherTrapThere).toBe(false);

    const newOtherPieceCoordinates = otherPiece.position?.coordinates;
    const otherItemCoordinates = otherTrapItem.position?.coordinates;
    expect(newOtherPieceCoordinates).toEqual(otherItemCoordinates);
  });
});
