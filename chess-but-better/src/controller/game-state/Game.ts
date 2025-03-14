import { BaseBoard } from "../../model/board/abstract/BaseBoard";
import { HeavenBoard } from "../../model/board/boards/HeavenBoard";
import { HellBoard } from "../../model/board/boards/HellBoard";
import { OverworldBoard } from "../../model/board/boards/OverworldBoard";
import { Player } from "../../model/player/Player";
import { IPlayer } from "../../model/player/abstract/IPlayer";
import { Team } from "../../model/player/team/Team";
import { TeamType } from "../../model/player/team/TeamTypes";
import { ITeam } from "../../model/player/team/abstract/ITeam";
import { GameEventEmitter } from "../events/GameEventEmitter";
import { EventType } from "../events/Events";
import { EndOfMoveEventHandler } from "../events/handlers/EndOfMoveEventHandler";
import { PieceKilledEventHandler } from "../events/handlers/PieceKilledEventHandler";
import { PieceMovedEventHandler } from "../events/handlers/PieceMovedEventHandler";
import { TurnCounterHandler } from "../events/handlers/end-of-move-handlers/TurnCounterHandler";
import { Bishop } from "../pieces/base/Bishop";
import { King } from "../pieces/base/King";
import { Knight } from "../pieces/base/Knight";
import { Pawn } from "../pieces/base/Pawn";
import { Queen } from "../pieces/base/Queen";
import { Rook } from "../pieces/base/Rook";
import { PiecesStorage } from "../storages/pieces-storage/PiecesStorage";
import { IPiecesStorage } from "../storages/pieces-storage/abstract/IPiecesStorage";
import { PlayersStorage } from "../storages/players-storage/PlayersStorage";
import { IPlayersStorage } from "../storages/players-storage/abstract/IPlayersStorage";
import { TurnCounter } from "./counters/turn-counter/TurnCounter";
import { ITurnCounter } from "./counters/turn-counter/abstract/ITurnCounter";
import { BoardService } from "./services/board/BoardService";
import { IBoardService } from "./services/board/abstract/IBoardService";
import { IPiecesService } from "./services/pieces/abstract/IPiecesService";
import { PiecesService } from "./services/pieces/PiecesService";
import { BoardType } from "../../model/board/BoardTypes";
import { VoidBoard } from "../../model/board/boards/VoidBoard";
import { PieceSpawnedEventHandler } from "../events/handlers/PieceSpawnedEventHandler";
import { FirstBloodHandler } from "../events/handlers/end-of-move-handlers/secret-rules/FirstBloodHandler";
import { FriendlyFireHandler } from "../events/handlers/end-of-move-handlers/secret-rules/FriendlyFireHandler";
import { VeteranHandler } from "../events/handlers/end-of-move-handlers/secret-rules/VeteranHandler";
import { BeggersHandler } from "../events/handlers/end-of-move-handlers/secret-rules/Beggers";
import { IItemsStorage } from "../storages/items-storage/abstract/IItemsStorage";
import { ItemsStorage } from "../storages/items-storage/ItemsStorage";
import { PiggyBank } from "../items/PiggyBank";
import { ItemsService } from "./services/items/ItemsService";
import { IItemsService } from "./services/items/abstract/IItemsService";
import { ItemPlacedEventHandler } from "../events/handlers/ItemPlacedEventHandler";

export class Game {
  // Teams
  private whiteTeam: ITeam;
  private blackTeam: ITeam;

  // Players
  private whitePlayer: IPlayer;
  private blackPlayer: IPlayer;

  // Boards
  public boards: Record<BoardType, BaseBoard>;

  // Storage
  public playersStorage: IPlayersStorage;
  private piecesStorage: IPiecesStorage;
  public itemsStorage: IItemsStorage;

  // Services
  public piecesService: IPiecesService;
  public boardService: IBoardService;
  public itemsService: IItemsService;

  // Counters
  public turnCounter: ITurnCounter;

  // Event Handlers
  public eventEmitter: GameEventEmitter;

  constructor() {
    // Teams
    this.whiteTeam = new Team(TeamType.WHITE);
    this.blackTeam = new Team(TeamType.BLACK);

    // Players
    this.whitePlayer = new Player('Player 1', this.whiteTeam);
    this.blackPlayer = new Player('Player 2', this.blackTeam);

    // Boards
    this.boards = {
      [BoardType.OVERWORLD]: new OverworldBoard(),
      [BoardType.HEAVEN]: new HeavenBoard(),
      [BoardType.HELL]: new HellBoard(),
      [BoardType.VOID]: new VoidBoard(),
    } as Record<BoardType, BaseBoard>;

    // Storage
    this.playersStorage = new PlayersStorage([this.whitePlayer, this.blackPlayer]);
    this.itemsStorage = new ItemsStorage([new PiggyBank(undefined)]);

    // Counters
    this.turnCounter = new TurnCounter(this.playersStorage);

    // Storage
    this.piecesStorage = new PiecesStorage([
      new Rook(this.blackTeam, { coordinates: { x: 0, y: 0 }, board: this.boards.overworld }),
      new Knight(this.blackTeam, { coordinates: { x: 1, y: 0 }, board: this.boards.overworld }),
      new Bishop(this.blackTeam, { coordinates: { x: 2, y: 0 }, board: this.boards.overworld }),
      new Queen(this.blackTeam, { coordinates: { x: 3, y: 0 }, board: this.boards.overworld }),
      new King(this.blackTeam, { coordinates: { x: 4, y: 0 }, board: this.boards.overworld }),
      new Bishop(this.blackTeam, { coordinates: { x: 5, y: 0 }, board: this.boards.overworld }),
      new Knight(this.blackTeam, { coordinates: { x: 6, y: 0 }, board: this.boards.overworld }),
      new Rook(this.blackTeam, { coordinates: { x: 7, y: 0 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 0, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 1, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 2, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 3, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 4, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 5, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 6, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.blackTeam, { coordinates: { x: 7, y: 1 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 0, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 1, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 2, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 3, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 4, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 5, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 6, y: 6 }, board: this.boards.overworld }),
      new Pawn(this.whiteTeam, { coordinates: { x: 7, y: 6 }, board: this.boards.overworld }),
      new Rook(this.whiteTeam, { coordinates: { x: 0, y: 7 }, board: this.boards.overworld }),
      new Knight(this.whiteTeam, { coordinates: { x: 1, y: 7 }, board: this.boards.overworld }),
      new Bishop(this.whiteTeam, { coordinates: { x: 2, y: 7 }, board: this.boards.overworld }),
      new Queen(this.whiteTeam, { coordinates: { x: 3, y: 7 }, board: this.boards.overworld }),
      new King(this.whiteTeam, { coordinates: { x: 4, y: 7 }, board: this.boards.overworld }),
      new Bishop(this.whiteTeam, { coordinates: { x: 5, y: 7 }, board: this.boards.overworld }),
      new Knight(this.whiteTeam, { coordinates: { x: 6, y: 7 }, board: this.boards.overworld }),
      new Rook(this.whiteTeam, { coordinates: { x: 7, y: 7 }, board: this.boards.overworld }),
    ]);

    // Event Handlers
    this.eventEmitter = new GameEventEmitter();

    // Services
    this.piecesService = new PiecesService(this.piecesStorage, this.turnCounter);
    this.boardService = new BoardService(this.boards, this.piecesStorage, this.piecesService, this.eventEmitter);
    this.itemsService = new ItemsService(this.itemsStorage);

    // Event Handlers - End Of Move
    const endOfMoveHandler = new EndOfMoveEventHandler();
    endOfMoveHandler.addHandler(new TurnCounterHandler(this.turnCounter));

    this.eventEmitter.on(EventType.END_OF_TURN, endOfMoveHandler.handle);

    // Event Handlers - Piece Moved
    const pieceMovedHandler = new PieceMovedEventHandler(this.eventEmitter, this.piecesStorage, this.boardService);
    this.eventEmitter.on(EventType.PIECE_MOVED, pieceMovedHandler.handle);

    // Event Handlers - Piece Killed
    const pieceKilledHandler = new PieceKilledEventHandler(this.eventEmitter, this.boards);
    this.eventEmitter.on(EventType.PIECE_KILLED, pieceKilledHandler.handle);

    // Event Handlers - Piece Spawned
    const pieceSpawnedHandler = new PieceSpawnedEventHandler(this.eventEmitter, this.piecesStorage);
    this.eventEmitter.on(EventType.PIECE_SPAWNED, pieceSpawnedHandler.handle);

    // Event Handler - Item Placed
    const itemPlacedHandler = new ItemPlacedEventHandler(this.piecesService, this.itemsService);
    this.eventEmitter.on(EventType.ITEM_PLACED, itemPlacedHandler.handle);

    // Event Handlers - Secret Rules
    const firstBloodHandler = new FirstBloodHandler();
    this.eventEmitter.on(EventType.AFTER_PIECE_KILLED, firstBloodHandler.handle);

    const veteranHandler = new VeteranHandler();
    this.eventEmitter.on(EventType.AFTER_PIECE_KILLED, veteranHandler.handle);

    const friendlyFireHandler = new FriendlyFireHandler();
    this.eventEmitter.on(EventType.AFTER_PIECE_KILLED, friendlyFireHandler.handle);

    const beggersHandler = new BeggersHandler(this.playersStorage);
    this.eventEmitter.on(EventType.END_OF_TURN, beggersHandler.handle);
  }
}
