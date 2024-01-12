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
  static rulesManger = new RulesManager();
  static whitePlayer = new Player(PlayerColors.WHITE);
  static blackPlayer = new Player(PlayerColors.BLACK);
  static players: Array<Player> = [Game.whitePlayer, Game.blackPlayer];
  static pieces: Piece[] = [
    new Rook({ coordinates: [0, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Knight({ coordinates: [1, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Bishop({ coordinates: [2, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Queen({ coordinates: [3, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new King({ coordinates: [4, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Bishop({ coordinates: [5, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Knight({ coordinates: [6, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Rook({ coordinates: [7, 0], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [0, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [1, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [2, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [3, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [4, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [5, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [6, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [7, 1], boardId: OVERWORLD_BOARD_ID }, this.blackPlayer),
    new Pawn({ coordinates: [0, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [1, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [2, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [3, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [4, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [5, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [6, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Pawn({ coordinates: [7, 6], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Rook({ coordinates: [0, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Knight({ coordinates: [1, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Bishop({ coordinates: [2, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Queen({ coordinates: [3, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new King({ coordinates: [4, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Bishop({ coordinates: [5, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Knight({ coordinates: [6, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
    new Rook({ coordinates: [7, 7], boardId: OVERWORLD_BOARD_ID }, this.whitePlayer),
  ];
  static items: Item[] = [];
  static currentPlayerIndex = 0;
  static turnCounter = 0;
  static roundCounter = 1;
  static deathCounter = 0;
  static isCastling = false;
  static isFriendlyFire = false;
  static isPieceKilled = false;
  static fellOffTheBoardPiece?: Piece | undefined = undefined;

  static increaseDeathCount = () => Game.deathCounter++;
  static triggerIsPieceKilled = () => Game.isPieceKilled = true;
  static updateFriendlyFireStatus = (updatedIsFriendlyFire: boolean) => Game.isFriendlyFire = updatedIsFriendlyFire;
  static updatePieces = (updatedPieces: Piece[]) => Game.pieces = updatedPieces;
  static updateItems = (updatedItems: Item[]) => Game.items = updatedItems;
  static updateFellOffTheBoardPiece = (piece: Piece) => Game.fellOffTheBoardPiece = piece;

  static endTurn() {
    Game.rulesManger.activeRules.forEach((rule) => {
      rule.trigger();
    });

    Game.resetVariables();

    Game.currentPlayerIndex = Game.currentPlayerIndex + 1 < Game.players.length ? Game.currentPlayerIndex + 1 : 0;
    Game.turnCounter++;
    if (Game.turnCounter % Game.players.length === 0) {
      Game.turnCounter = 0;
      Game.roundCounter++;
    }

    renderScreen();
  }

  static resetVariables() {
    Game.isCastling = false;
    Game.isFriendlyFire = false;
    Game.isPieceKilled = false;
    Game.fellOffTheBoardPiece = undefined;

    Game.pieces.forEach((piece) => {
      if (piece.player !== Game.getCurrentPlayer() && piece instanceof Pawn) {
        const pawn = piece as Pawn;
        pawn.enPassant = false;
        pawn.enPassantPosition = undefined;
      }
    });
  }

  static getCurrentPlayer(): Player {
    return Game.players[Game.currentPlayerIndex];
  }

  static switchIsCastling() {
    Game.isCastling = !Game.isCastling;
  }
}

console.log('Game.ts loaded.');
