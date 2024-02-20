import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Rook } from './Rook';
import { Pawn } from './Pawn';

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
  initialiseInventoryUI: jest.fn(),
  switchShownInventory: jest.fn(),
  showItemOnInventory: jest.fn(),
}));

game.getCurrentPlayer = jest.fn().mockReturnValue(whitePlayer);

describe('Piece movements', () => {
  test('Validating Rook movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const rook = new Rook(initialPosition, whitePlayer);
    game.setPieces([rook]);

    const newPosition: Position = {
      coordinates: [0, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = rook.getLegalMoves();
    expect(validMoves).toContainEqual(newPosition);
    
    const invalidPosition: Position = {
      coordinates: [7, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = rook.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test ('Validating Rook killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerRook = new Rook(initialKillerPosition, whitePlayer);

    const victimPosition: Position = {
      coordinates: [3, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPiece = new Pawn(victimPosition, blackPlayer);

    game.initialize();
    game.setPieces([killerRook, victimPiece]);
    onPlayerAction(killerRook, victimPiece);
    
    const victimPieceBoardId = victimPiece.position.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);
    
    const killerNewCoordinates = killerRook.position.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const playerXP = killerRook.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
