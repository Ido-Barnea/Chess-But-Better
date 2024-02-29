import { game } from '../../Game';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Pawn } from './Pawn';
import { DoubleQueen } from './DoubleQueen';

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
  test('Validating Double Queen movement', () => {
    const initialPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const doubleQueen = new DoubleQueen(whitePlayer, initialPosition);
    game.setPieces([doubleQueen]);

    const newStraightPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = doubleQueen.getLegalMoves();
    expect(validMoves).toContainEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = doubleQueen.getLegalMoves();
    expect(validMoves).toContainEqual(newDiagonalPosition);

    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = doubleQueen.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);

    game.initialize();

    game.setPieces([doubleQueen]);

    const targetPosition: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };

    onPlayerAction(doubleQueen, { position: targetPosition });
    expect(game.getMovesLeft()).toEqual(1);

    onPlayerAction(doubleQueen, { position: initialPosition });
    expect(game.getMovesLeft()).toEqual(0);
  });
});

describe('Piece killing', () => {
  test('Validating Queen killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerDoubleQueen = new DoubleQueen(
      whitePlayer,
      initialKillerPosition,
    );
    const victimPiece = new Pawn(blackPlayer, victimPosition);

    game.initialize();

    game.setPieces([killerDoubleQueen, victimPiece]);
    onPlayerAction(killerDoubleQueen, victimPiece);

    const victimPieceBoardId = victimPiece.position?.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerDoubleQueen.position?.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    // Diagonal kill
    killerDoubleQueen.position = initialKillerPosition;

    const otherVictimPosition: Position = {
      coordinates: [6, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherVictimPiece = new Pawn(blackPlayer, otherVictimPosition);
    otherVictimPiece.killCount = 1;

    game.setPieces([killerDoubleQueen, otherVictimPiece]);
    onPlayerAction(killerDoubleQueen, otherVictimPiece);

    const otherVictimPieceBoardId = otherVictimPiece.position?.boardId;
    expect(otherVictimPieceBoardId).toEqual(HELL_BOARD_ID);

    killerNewCoordinates = killerDoubleQueen.position.coordinates;
    expect(killerNewCoordinates).toEqual(otherVictimPosition.coordinates);

    const playerXP = killerDoubleQueen.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
