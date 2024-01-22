import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player, PlayerColors } from '../Players';
import { Position } from './PiecesUtilities';
import { Rook } from './Rook';

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
      coordinates: [3,3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerRook = new Rook(initialKillerPosition, whitePlayer);

    const initialVictimPosition: Position = {
      coordinates: [3,5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimRook = new Rook(initialVictimPosition, blackPlayer);

    game.initialize();
    game.setPieces([killerRook,victimRook]);
    onPlayerAction(killerRook,victimRook);
    
    const killedPieceBoardId = victimRook.position.boardId;
    expect(killedPieceBoardId).toEqual(HEAVEN_BOARD_ID);
    
    const killerNewCoordinates = killerRook.position.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    const playerXp = killerRook.player.xp;
    expect(playerXp).toBeGreaterThan(0);
  });
});
