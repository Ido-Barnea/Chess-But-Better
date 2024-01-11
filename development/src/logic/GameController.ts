import { renderScreen } from '../LogicAdapter';
import { OVERWORLD_BOARD_ID } from './Constants';
import { Player, PlayerColors } from './Players';
import { Item } from './items/Items';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Knight } from './pieces/Knight';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';
import { RulesManager } from './rules/RulesManager';

export class Game {
  rulesManger: RulesManager;
  whitePlayer: Player;
  blackPlayer: Player;
  players: Player[] = [];
  pieces: Piece[];
  items: Item[];
  currentPlayerIndex: number;
  turnCounter: number;
  roundCounter: number;
  deathCounter: number;
  isCastling: boolean;
  isFriendlyFire: boolean;
  isPieceKilled: boolean;
  fellOffTheBoardPiece?: Piece;

  constructor() {
    this.rulesManger = new RulesManager(this);
    this.whitePlayer = new Player(PlayerColors.WHITE);
    this.blackPlayer = new Player(PlayerColors.BLACK);
    this.players = [this.whitePlayer, this.blackPlayer];
    this.pieces = [
      new Rook(this, { coordinates: [0, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Knight(this, { coordinates: [1, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Bishop(this, { coordinates: [2, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Queen(this, { coordinates: [3, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new King(this, { coordinates: [4, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Bishop(this, { coordinates: [5, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Knight(this, { coordinates: [6, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Rook(this, { coordinates: [7, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [0, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [1, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [2, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [3, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [4, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [5, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [6, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [7, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
      new Pawn(this, { coordinates: [0, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [1, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [2, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [3, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [4, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [5, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [6, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Pawn(this, { coordinates: [7, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Rook(this, { coordinates: [0, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Knight(this, { coordinates: [1, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Bishop(this, { coordinates: [2, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Queen(this, { coordinates: [3, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new King(this, { coordinates: [4, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Bishop(this, { coordinates: [5, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Knight(this, { coordinates: [6, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
      new Rook(this, { coordinates: [7, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    ];
    this.items = [];
    this.currentPlayerIndex = 0;
    this.turnCounter = 0;
    this.roundCounter = 1;
    this.deathCounter = 0;
    this.isCastling = false;
    this.isFriendlyFire = false;
    this.isPieceKilled = false;
    this.fellOffTheBoardPiece = undefined;
  }

  increaseDeathCount = () => this.deathCounter++;
  triggerIsPieceKilled = () => this.isPieceKilled = true;
  updateFriendlyFireStatus = (updatedIsFriendlyFire: boolean) => this.isFriendlyFire = updatedIsFriendlyFire;
  updatePieces = (updatedPieces: Piece[]) => this.pieces = updatedPieces;
  updateItems = (updatedItems: Item[]) => this.items = updatedItems;
  updateFellOffTheBoardPiece = (piece: Piece) => this.fellOffTheBoardPiece = piece;

  endTurn() {
    this.rulesManger.activeRules.forEach((rule) => {
      rule.trigger();
    });

    this.resetVariables();

    this.currentPlayerIndex = this.currentPlayerIndex + 1 < this.players.length ? this.currentPlayerIndex + 1 : 0;
    this.turnCounter++;
    if (this.turnCounter % this.players.length === 0) {
      this.turnCounter = 0;
      this.roundCounter++;
    }

    renderScreen(this);
  }

  resetVariables() {
    this.isCastling = false;
    this.isFriendlyFire = false;
    this.isPieceKilled = false;
    this.fellOffTheBoardPiece = undefined;

    this.pieces.forEach((piece) => {
      if (piece.player !== this.getCurrentPlayer() && piece instanceof Pawn) {
        const pawn = piece as Pawn;
        pawn.enPassant = false;
        pawn.enPassantPosition = undefined;
      }
    });
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  switchIsCastling() {
    this.isCastling = !this.isCastling;
  }
}
