import { game } from '../../Game';
import { HEAVEN_BOARD_ID, HELL_BOARD_ID, OVERWORLD_BOARD_ID } from '../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Queen } from './Queen';
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
  renderNewRule: jest.fn(),
  renderPlayersInformation: jest.fn(),
}));
jest.mock('../../ui/Logger.ts');
jest.mock('../../ui/Events.ts', () => ({}));

game.getCurrentPlayer = jest.fn().mockReturnValue(whitePlayer);

describe('Piece movements', () => {
  test('Validating Queen movement', () => {
    const initialPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const queen = new Queen(initialPosition, whitePlayer);
    game.setPieces([queen]);

    const newStraightPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = queen.getLegalMoves();
    expect(validMoves).toContainEqual(newStraightPosition);

    const newDiagonalPosition: Position = {
      coordinates: [5, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = queen.getLegalMoves();
    expect(validMoves).toContainEqual(newDiagonalPosition);
    
    const invalidPosition: Position = {
      coordinates: [0, 0],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = queen.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test ('Validating Queen killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [2, 2],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerQueen = new Queen(initialKillerPosition, whitePlayer);

    const victimPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPiece = new Pawn(victimPosition, blackPlayer);

    game.initialize();
    game.setPieces([killerQueen,victimPiece]);
    onPlayerAction(killerQueen,victimPiece);
    
    const victimPieceBoardId = victimPiece.position.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);
    
    let killerNewCoordinates = killerQueen.position.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    // Diagonal kill
    killerQueen.position = initialKillerPosition;

    const otherVictimPosition: Position = {
      coordinates: [6, 6],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherVictimPiece = new Pawn(otherVictimPosition, blackPlayer);
    otherVictimPiece.killCount = 1;

    game.setPieces([killerQueen, otherVictimPiece]);
    onPlayerAction(killerQueen, otherVictimPiece);

    const otherVictimPieceBoardId = otherVictimPiece.position.boardId;
    expect(otherVictimPieceBoardId).toEqual(HELL_BOARD_ID);

    killerNewCoordinates = killerQueen.position.coordinates;
    expect(killerNewCoordinates).toEqual(otherVictimPosition.coordinates);

    const playerXP = killerQueen.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
