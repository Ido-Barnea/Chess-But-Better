import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player } from '../players/Player';
import { Knight } from './Knight';
import { Rook } from './Rook';
import { PlayerColor } from '../players/types/PlayerColor';
import { PlayerInventory } from '../inventory/PlayerInventory';
import { Position } from '../../../model/types/Position';

const whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());
const blackPlayer = new Player(PlayerColor.BLACK, new PlayerInventory());

jest.mock('../../ui/BoardManager.ts', () => ({
  destroyElementOnBoard: jest.fn(),
  moveElementOnBoard: jest.fn(),
  spawnPieceElementOnBoard: jest.fn(),
  getSquareElementById: jest.fn(),
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

const getCurrentPlayerMock = jest.fn().mockReturnValue(whitePlayer);
const getTurnsCount = jest.fn().mockReturnValue(1);
game.getPlayersTurnSwitcher = jest.fn().mockReturnValue({
  getCurrentPlayer: getCurrentPlayerMock,
  getTurnsCount: getTurnsCount,
});

describe('Piece movements', () => {
  test('Validating Knight movement', () => {
    const initialPosition: Position = {
      coordinates: [1, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    const knight = new Knight(whitePlayer, initialPosition);
    game.setPieces([knight]);

    const validPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = knight.getLegalMoves();
    expect(validMoves).toContainEqual(validPosition);

    const invalidPosition: Position = {
      coordinates: [1, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = knight.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Knight killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const victimPosition: Position = {
      coordinates: [1, 4],
      boardId: OVERWORLD_BOARD_ID,
    };

    const killerKnight = new Knight(whitePlayer, initialKillerPosition);
    const victimPiece = new Knight(blackPlayer, victimPosition);

    game.initialize();

    game.setPieces([killerKnight, victimPiece]);
    onPlayerAction(killerKnight, victimPiece);

    const victimPieceBoardId = victimPiece.position?.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    let killerNewCoordinates = killerKnight.position?.coordinates;
    expect(killerNewCoordinates).toEqual(victimPosition.coordinates);

    const othervictimPosition: Position = {
      coordinates: [2, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const otherVictimPiece = new Rook(blackPlayer, othervictimPosition);
    killerKnight.position = initialKillerPosition;

    game.setPieces([killerKnight, otherVictimPiece]);
    onPlayerAction(killerKnight, otherVictimPiece);

    const otherVictimPieceBoardId = otherVictimPiece.position?.boardId;
    expect(otherVictimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    killerNewCoordinates = killerKnight.position.coordinates;
    expect(killerNewCoordinates).toEqual(othervictimPosition.coordinates);

    const playerXP = killerKnight.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
