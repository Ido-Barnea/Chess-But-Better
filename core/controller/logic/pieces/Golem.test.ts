import { game } from '../../Game';
import { HEAVEN_BOARD_ID, OVERWORLD_BOARD_ID } from '../../Constants';
import { onPlayerAction } from '../PieceLogic';
import { Player } from '../players/Player';
import { Pawn } from './Pawn';
import { Golem } from './Golem';
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
  test('Validating Golem movement', () => {
    const initialPosition: Position = {
      coordinates: [0, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const golem = new Golem(whitePlayer, initialPosition);
    game.setPieces([golem]);

    const validPosition: Position = {
      coordinates: [0, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    let validMoves = golem.getLegalMoves();
    expect(validMoves).toContainEqual(validPosition);

    const invalidPosition: Position = {
      coordinates: [7, 7],
      boardId: OVERWORLD_BOARD_ID,
    };
    validMoves = golem.getLegalMoves();
    expect(validMoves).not.toContainEqual(invalidPosition);
  });
});

describe('Piece killing', () => {
  test('Validating Golem killing', () => {
    const initialKillerPosition: Position = {
      coordinates: [3, 3],
      boardId: OVERWORLD_BOARD_ID,
    };
    const killerGolem = new Golem(whitePlayer, initialKillerPosition);

    const initialVictimPosition: Position = {
      coordinates: [3, 5],
      boardId: OVERWORLD_BOARD_ID,
    };
    const firstVictimPiece = new Pawn(blackPlayer, {
      coordinates: initialVictimPosition.coordinates,
      boardId: initialVictimPosition.boardId,
    });

    game.initialize();

    game.setPieces([killerGolem, firstVictimPiece]);
    onPlayerAction(killerGolem, firstVictimPiece);

    const victimPieceBoardId = firstVictimPiece.position?.boardId;
    expect(victimPieceBoardId).toEqual(HEAVEN_BOARD_ID);

    const killerNewCoordinates = killerGolem.position?.coordinates;
    expect(killerNewCoordinates).toEqual(initialVictimPosition.coordinates);

    const playerXP = killerGolem.player.xp;
    expect(playerXP).toBeGreaterThan(0);
  });
});
