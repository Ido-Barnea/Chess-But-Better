import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../../Constants';
import { Position, Square } from '../../pieces/PiecesUtilities';
import { PiggyBank } from '../PiggyBank';
import { Player } from '../../players/Player';
import { onPlayerAction } from '../../PieceLogic';
import { game } from '../../../Game';
import { Rook } from '../../pieces/Rook';
import { Trap } from '../Trap';
import { PlayerColor } from '../../players/PlayerColor';

const whitePlayer = new Player(PlayerColor.WHITE);

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
}));
jest.mock('../../ui/logs/Logger.ts');
jest.mock('../../ui/Events.ts', () => ({}));
jest.mock('../../ui/InventoriesUI.ts', () => ({
  initializeInventoryUI: jest.fn(),
  switchShownInventory: jest.fn(),
  showItemOnInventory: jest.fn(),
}));
jest.mock('../../ui/ShopUI.ts');

game.getCurrentPlayer = jest.fn().mockReturnValue(whitePlayer);

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

    const newOtherPiecePosition = otherPiece.position?.coordinates;
    expect(newOtherPiecePosition).toEqual(otherItemPosition.coordinates);
  });
});
