import { OVERWORLD_BOARD_ID } from './Constants';
import { EndOfMoveHandlersNotifier } from './handlers/EndOfMoveHandlersNotifier';
import { MoveCountHandler } from './handlers/MoveCountHandler';
import { PawnPromotionHandler } from './handlers/PawnPromotionHandler';
import { RulesManagerHandler } from './handlers/SecretRulesHandler';
import { IEndOfMoveHandlersNotifier } from './handlers/abstract/IEndOfMoveHandlersNotifier';
import { PlayerInventory } from './inventory/PlayerInventory';
import { MovesCounter } from './game state/counters/moves counter/MovesCounter';
import { IMovesCounter } from './game state/counters/moves counter/abstract/IMovesCounter';
import { PiecesStorage } from './game state/storages/pieces storage/PiecesStorage';
import { IEditablePiecesStorage } from './game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Knight } from './pieces/Knight';
import { Pawn } from './pieces/Pawn';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';
import { PlayersStorage } from './game state/storages/players storage/PlayersStorage';
import { IPlayersStorage } from './game state/storages/players storage/abstract/IPlayersStorage';
import { Player } from './game state/storages/players storage/Player';
import { PlayerColor } from './game state/storages/players storage/types/PlayerColor';
import { BountyRule } from './rules/BountyRule';
import { CoupRule } from './rules/CoupRule';
import { EmptyPocketsRule } from './rules/EmptyPocketsRule';
import { ExperienceOnKillRule } from './rules/ExperienceOnKillRule';
import { FirstBloodRule } from './rules/FirstBloodRule';
import { FriendlyFireRule } from './rules/FriendlyFireRule';
import { PiecesCanFallOffTheBoardRule } from './rules/PiecesCanFallOffTheBoardRule';
import { SecretRulesManager } from './rules/SecretRulesManager';
import { WithAgeComesWisdomRule } from './rules/WithAgeComesWisdomRule';
import { ISecretRulesManager } from './rules/abstract/ISecretRulesManager';
import { CastlingSwitcher } from './game state/switchers/castling switcher/CastlingSwitcher';
import { ICastlingSwitcher } from './game state/switchers/castling switcher/abstract/ICastlingSwitcher';
import { PlayersTurnSwitcher } from './game state/switchers/turn switcher/PlayersTurnSwitcher';
import { ITurnSwitcher } from './game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { FriendlyFireSwitcher } from './game state/switchers/friendly fire switcher/FriendlyFireSwitcher';
import { IFriendlyFireSwitcher } from './game state/switchers/friendly fire switcher/abstract/IFriendlyFireSwitcher';
import { KillerPieceSwitcher } from './game state/switchers/killer piece switcher/KillerPieceSwitcher';
import { IKillerPieceSwitcher } from './game state/switchers/killer piece switcher/abstract/IKillerPieceSwitcher';
import { DeathsCounter } from './game state/counters/deaths counter/DeathsCounter';
import { IDeathsCounter } from './game state/counters/deaths counter/abstract/IDeathsCounter';
import { IFellOffTheBoardPieceSwitcher } from './game state/switchers/fell off the board piece switcher/abstract/IFellOffTheBoardPieceSwitcher';
import { FellOffTheBoardPieceSwitcher } from './game state/switchers/fell off the board piece switcher/FellOffTheBoardPieceSwitcher';
import { TurnSwitcherHandler } from './handlers/TurnSwitcherHandler';
import { IPiecesStorage } from './game state/storages/pieces storage/abstract/IPiecesStorage';

export class Bootstrapper {
  private whitePlayer: Player;
  private blackPlayer: Player;

  private turnSwitcher: ITurnSwitcher;
  private castlingSwitcher: ICastlingSwitcher;
  private friendlyFireSwitcher: IFriendlyFireSwitcher;
  private killerPieceSwitcher: IKillerPieceSwitcher;
  private fellOffTheBoardPieceSwitcher: IFellOffTheBoardPieceSwitcher;

  private deathsCounter: IDeathsCounter;

  private piecesStorage: IEditablePiecesStorage;
  private playersStorage: IPlayersStorage;

  private secretRulesManager: ISecretRulesManager;
  private movesCounter: IMovesCounter;

  private endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier;

  constructor() {
    this.whitePlayer = new Player(PlayerColor.WHITE, new PlayerInventory());
    this.blackPlayer = new Player(PlayerColor.BLACK, new PlayerInventory());

    this.turnSwitcher = new PlayersTurnSwitcher([
      this.whitePlayer,
      this.blackPlayer,
    ]);
    this.castlingSwitcher = new CastlingSwitcher();
    this.friendlyFireSwitcher = new FriendlyFireSwitcher();
    this.killerPieceSwitcher = new KillerPieceSwitcher();
    this.fellOffTheBoardPieceSwitcher = new FellOffTheBoardPieceSwitcher();

    this.deathsCounter = new DeathsCounter();

    this.playersStorage = new PlayersStorage([
      this.whitePlayer,
      this.blackPlayer,
    ]);

    this.piecesStorage = new PiecesStorage([
      new Rook(this.blackPlayer, {
        coordinates: { x: 0, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Knight(this.blackPlayer, {
        coordinates: { x: 1, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Bishop(this.blackPlayer, {
        coordinates: { x: 2, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Queen(this.blackPlayer, {
        coordinates: { x: 3, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new King(this.blackPlayer, this.castlingSwitcher, {
        coordinates: { x: 4, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Bishop(this.blackPlayer, {
        coordinates: { x: 5, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Knight(this.blackPlayer, {
        coordinates: { x: 6, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Rook(this.blackPlayer, {
        coordinates: { x: 7, y: 0 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 0, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 1, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 2, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 3, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 4, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 5, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 6, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.blackPlayer, this.turnSwitcher, {
        coordinates: { x: 7, y: 1 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 0, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 1, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 2, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 3, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 4, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 5, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 6, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Pawn(this.whitePlayer, this.turnSwitcher, {
        coordinates: { x: 7, y: 6 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Rook(this.whitePlayer, {
        coordinates: { x: 0, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Knight(this.whitePlayer, {
        coordinates: { x: 1, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Bishop(this.whitePlayer, {
        coordinates: { x: 2, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Queen(this.whitePlayer, {
        coordinates: { x: 3, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new King(this.whitePlayer, this.castlingSwitcher, {
        coordinates: { x: 4, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Bishop(this.whitePlayer, {
        coordinates: { x: 5, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Knight(this.whitePlayer, {
        coordinates: { x: 6, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
      new Rook(this.whitePlayer, {
        coordinates: { x: 7, y: 7 },
        boardId: OVERWORLD_BOARD_ID,
      }),
    ]);

    this.secretRulesManager = new SecretRulesManager([
      new PiecesCanFallOffTheBoardRule(
        this.turnSwitcher,
        this.fellOffTheBoardPieceSwitcher,
      ),
      new FirstBloodRule(
        this.turnSwitcher,
        this.deathsCounter,
        this.killerPieceSwitcher,
      ),
      new ExperienceOnKillRule(this.turnSwitcher, this.killerPieceSwitcher),
      new FriendlyFireRule(this.turnSwitcher, this.friendlyFireSwitcher),
      new WithAgeComesWisdomRule(this.turnSwitcher, this.playersStorage),
      new EmptyPocketsRule(this.turnSwitcher, this.playersStorage),
      new CoupRule(this.turnSwitcher, this.playersStorage, this.piecesStorage),
      new BountyRule(this.turnSwitcher, this.piecesStorage),
    ]);
    this.movesCounter = new MovesCounter();

    this.endOfMoveHandlersNotifier = new EndOfMoveHandlersNotifier();
    this.endOfMoveHandlersNotifier.addHandler(
      new TurnSwitcherHandler(this.turnSwitcher),
    );
    this.endOfMoveHandlersNotifier.addHandler(
      new RulesManagerHandler(this.secretRulesManager),
    );
    this.endOfMoveHandlersNotifier.addHandler(
      new MoveCountHandler(this.movesCounter),
    );
    this.endOfMoveHandlersNotifier.addHandler(
      new PawnPromotionHandler(this.piecesStorage),
    );
  }

  // Create an interface for this.
  getTools(): {
    movesCounter: IMovesCounter;
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier;
    turnSwitcher: ITurnSwitcher;
    piecesStorage: IPiecesStorage;
  } {
    return {
      movesCounter: this.movesCounter,
      endOfMoveHandlersNotifier: this.endOfMoveHandlersNotifier,
      turnSwitcher: this.turnSwitcher,
      piecesStorage: this.piecesStorage,
    };
  }
}
