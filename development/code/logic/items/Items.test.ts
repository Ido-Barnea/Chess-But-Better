import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../Constants';
import { Position } from '../pieces/PiecesUtilities';
import { PiggyBank } from './PiggyBank';
import { Player, PlayerColors } from '../Players';
import { onPlayerAction } from '../PieceLogic';
import { game } from '../../Game';
import { Rook } from '../pieces/Rook';
import { Trap } from './Trap';

const whitePlayer = new Player(PlayerColors.WHITE);

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getAllSquareElements: jest.fn(),
  highlightLastMove: jest.fn(),
}));
jest.mock('../../ui/Screen.ts', () => ({
  renderNewRule: jest.fn(),
  renderPlayersInformation: jest.fn(),
}));
jest.mock('../../ui/Logger.ts');
jest.mock('../../ui/Events.ts', () => ({}));

game.getCurrentPlayer = jest.fn().mockReturnValue(whitePlayer);

  
describe('Items test', () => {
  test('PiggyBank test', () => {
    const initialPiecePosition: Position = {
      coordinates: [4, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Rook(initialPiecePosition, whitePlayer);

    const initialItemPosition: Position = {
      coordinates: [2, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piggyBankItem = new PiggyBank(initialItemPosition);
    
    game.initialize();
    game.setItems([piggyBankItem]);
    game.setPieces([piece]);
    onPlayerAction(piece, piggyBankItem);

    const whitePlayerMoney = whitePlayer.gold;
    expect(whitePlayerMoney).toBeGreaterThan(0);

    const isPiggyBankThere = game.getItems().includes(piggyBankItem);
    expect(isPiggyBankThere).toBe(false);
    
    const newPieceCoordinates = piece.position.coordinates;
    expect(newPieceCoordinates).not.toEqual(initialPiecePosition.coordinates);
  });

  test('Trap test', () => {
    const initialPiecePosition: Position = {
      coordinates: [3, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const piece = new Rook(initialPiecePosition, whitePlayer);
    
    const initialItemPosition: Position = {
      coordinates: [2, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const trapItem = new Trap(initialItemPosition);
    
    game.initialize();
    game.setItems([trapItem]);
    game.setPieces([piece]);
    onPlayerAction(piece, trapItem);

    const pieceNewBoard = piece.position.boardId;
    expect(pieceNewBoard).toEqual(HEAVEN_BOARD_ID);

    const isTrapThere = game.getItems().includes(trapItem);
    expect(isTrapThere).toBe(false);

    const newPieceCoordinates = piece.position.coordinates;
    expect(newPieceCoordinates).toEqual(initialItemPosition.coordinates);
  });
});
