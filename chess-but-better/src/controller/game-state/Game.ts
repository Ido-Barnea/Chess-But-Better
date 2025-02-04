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

export class Game {
  // Teams
  private whiteTeam: ITeam;
  private blackTeam: ITeam;

  // Players
  private whitePlayer: IPlayer;
  private blackPlayer: IPlayer;

  // Boards
  private overworldBoard: BaseBoard;
  private heavenBoard: BaseBoard;
  private hellBoard: BaseBoard;

  // Storage
  public playersStorage: IPlayersStorage;
  public piecesStorage: IPiecesStorage;

  // Services
  public piecesService: IPiecesService;
  public boardService: IBoardService;

  // Counters
  private turnCounter: ITurnCounter;

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
    this.overworldBoard = new OverworldBoard();
    this.heavenBoard = new HeavenBoard();
    this.hellBoard = new HellBoard();

    // Storage
    this.playersStorage = new PlayersStorage([this.whitePlayer, this.blackPlayer]);

    // Counters
    this.turnCounter = new TurnCounter(this.playersStorage);

    // Storage
    this.piecesStorage = new PiecesStorage([
      new Rook(this.blackTeam, { coordinates: { x: 0, y: 0 }, board: this.overworldBoard }),
      new Knight(this.blackTeam, { coordinates: { x: 1, y: 0 }, board: this.overworldBoard }),
      new Bishop(this.blackTeam, { coordinates: { x: 2, y: 0 }, board: this.overworldBoard }),
      new Queen(this.blackTeam, { coordinates: { x: 3, y: 0 }, board: this.overworldBoard }),
      new King(this.blackTeam, { coordinates: { x: 4, y: 0 }, board: this.overworldBoard }),
      new Bishop(this.blackTeam, { coordinates: { x: 5, y: 0 }, board: this.overworldBoard }),
      new Knight(this.blackTeam, { coordinates: { x: 6, y: 0 }, board: this.overworldBoard }),
      new Rook(this.blackTeam, { coordinates: { x: 7, y: 0 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 0, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 1, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 2, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 3, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 4, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 5, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 6, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.blackTeam, { coordinates: { x: 7, y: 1 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 0, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 1, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 2, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 3, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 4, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 5, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 6, y: 6 }, board: this.overworldBoard }),
      new Pawn(this.whiteTeam, { coordinates: { x: 7, y: 6 }, board: this.overworldBoard }),
      new Rook(this.whiteTeam, { coordinates: { x: 0, y: 7 }, board: this.overworldBoard }),
      new Knight(this.whiteTeam, { coordinates: { x: 1, y: 7 }, board: this.overworldBoard }),
      new Bishop(this.whiteTeam, { coordinates: { x: 2, y: 7 }, board: this.overworldBoard }),
      new Queen(this.whiteTeam, { coordinates: { x: 3, y: 7 }, board: this.overworldBoard }),
      new King(this.whiteTeam, { coordinates: { x: 4, y: 7 }, board: this.overworldBoard }),
      new Bishop(this.whiteTeam, { coordinates: { x: 5, y: 7 }, board: this.overworldBoard }),
      new Knight(this.whiteTeam, { coordinates: { x: 6, y: 7 }, board: this.overworldBoard }),
      new Rook(this.whiteTeam, { coordinates: { x: 7, y: 7 }, board: this.overworldBoard }),
    ]);

    // Event Handlers
    this.eventEmitter = new GameEventEmitter();

    // Services
    this.piecesService = new PiecesService(this.piecesStorage);
    this.boardService = new BoardService(this.eventEmitter, this.piecesStorage, this.piecesService);

    // Event Handlers - End Of Move
    const endOfMoveEventHandler = new EndOfMoveEventHandler();
    endOfMoveEventHandler.addHandler(new TurnCounterHandler(this.turnCounter));

    this.eventEmitter.on(EventType.END_OF_TURN, endOfMoveEventHandler.handle);

    // Event Handlers - Piece Moved
    const pieceMovedEventHandler = new PieceMovedEventHandler(this.eventEmitter, this.piecesStorage, this.piecesService);
    this.eventEmitter.on(EventType.PIECE_MOVED, pieceMovedEventHandler.handle);

    // Event Handlers - Piece Killed
    const pieceKilledEventHandler = new PieceKilledEventHandler(this.piecesStorage);
    this.eventEmitter.on(EventType.PIECE_KILLED, pieceKilledEventHandler.handle);
  }
}
