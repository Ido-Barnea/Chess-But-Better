import { game } from '../../Game';
import { HELL_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { King } from './King';
import { Position } from './PiecesUtilities';

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
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

describe('Piece movements', () => {
  test('Validating King movement', () => {
    const initialPosition: Position = {
      coordinates: [4, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const king = new King(initialPosition, whitePlayer);
    game.setPieces([king]);

    const newStraightPosition: Position = {
      coordinates: [4, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = king.getLegalMoves();
    expect(validMoves).toContainEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = king.getLegalMoves();
    expect(validMoves).toContainEqual(newDiagonalPosition);

    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = king.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating King killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 4],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPosition: Position = {
      coordinates: [4, 5],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerKing = new King(initialKillerPosition, whitePlayer);
    const victimPiece = new King(victimPosition, blackPlayer);

    game.initialize();

    game.setPieces([killerKing, victimPiece]);
    onPlayerAction(killerKing, victimPiece);

    const victimPieceBoardId = victimPiece.position.boardId;
    expect(victimPieceBoardId).toEqual(HELL_BOARD_ID);

    const killerNewCoordinates = killerKing.position.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const playerXP = killerKing.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
