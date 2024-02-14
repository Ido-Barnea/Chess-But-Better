import { changeShownInventory, renderScreen } from './LogicAdapter';
import { OVERWORLD_BOARD_ID } from './logic/Constants';
import { Player, PlayerColors } from './logic/Players';
import { Item } from './logic/items/Items';
import { Bishop } from './logic/pieces/Bishop';
import { King } from './logic/pieces/King';
import { Knight } from './logic/pieces/Knight';
import { Pawn } from './logic/pieces/Pawn';
import { Piece } from './logic/pieces/Piece';
import { Queen } from './logic/pieces/Queen';
import { Rook } from './logic/pieces/Rook';
import { RulesManager } from './logic/rules/RulesManager';
import { showWinningAlert as showGameEndAlert } from './ui/Screen';
import { Logger } from './ui/logs/Logger';
import { initialiseInventoryUI } from './ui/InventoriesUI';
import { Trap } from './logic/items/Trap';

let rulesManager: RulesManager;
const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);
const players: Array<Player> = [whitePlayer, blackPlayer];
let pieces: Array<Piece> = [
  new Rook({ coordinates: [0, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Knight({ coordinates: [1, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Bishop({ coordinates: [2, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Queen({ coordinates: [3, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new King({ coordinates: [4, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Bishop({ coordinates: [5, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Knight({ coordinates: [6, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Rook({ coordinates: [7, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [0, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [1, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [2, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [3, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [4, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [5, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [6, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [7, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [0, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [1, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [2, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [3, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [4, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [5, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [6, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [7, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Rook({ coordinates: [0, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Knight({ coordinates: [1, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Bishop({ coordinates: [2, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Queen({ coordinates: [3, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new King({ coordinates: [4, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Bishop({ coordinates: [5, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Knight({ coordinates: [6, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Rook({ coordinates: [7, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
];
let items: Array<Item> = [];
let currentPlayerIndex = 0;
let turnCounter = 0;
let roundCounter = 1;
let deathCounter = 0;
let isCastling = false;
let isFriendlyFire = false;
let isPieceKilled = false;
let itemPlacedDownRecently = false;
let fellOffTheBoardPiece: Piece | undefined;
let isGameFinished = false;

function initializeGame() {
  rulesManager = new RulesManager();

  players.forEach((player) => {
    initialiseInventoryUI(player.color);
  });
}

function endTurn() {
  rulesManager.activeRules.forEach((rule) => {
    rule.trigger();
  });

  resetVariables();
  updatePlayerDetails();

  currentPlayerIndex = currentPlayerIndex + 1 < players.length ? currentPlayerIndex + 1 : 0;
  turnCounter++;
  if (turnCounter % players.length === 0) {
    turnCounter = 0;
    roundCounter++;
  }

  Logger.logMessages();

  players.forEach((player) => {
    changeShownInventory(player);
  });

  renderScreen();
  itemPlacedDownRecently = false;

  // element.remove() is scheduled to run in the next event sycle while alert() runs immedietely.
  // To make sure the element is removed before displaying the winning alert, we need to add
  // a small delay before displaying the alert.
  setTimeout(() => {  
    if (isGameFinished) {
      const livingKingPlayer = pieces.filter(piece => piece instanceof King)[0].player;

      showGameEndAlert(livingKingPlayer.color);
      window.location.reload();
    }
  }, 10);
}

function resetVariables() {
  isCastling = false;
  isFriendlyFire = false;
  isPieceKilled = false;
  fellOffTheBoardPiece = undefined;

  pieces.forEach((piece) => {
    if (piece.player !== getCurrentPlayer() && piece instanceof Pawn) {
      piece.possibleEnPassantPositions = undefined;
      piece.isInitialDoubleStep = false;
      piece.diagonalAttackPosition = undefined;
    }
  });
}

function updatePlayerDetails() {
  game.getPlayers().forEach(player => {
    if (player === getCurrentPlayer()) {
      if (player.gold < 0) {
        player.inDebtForTurns++;
      } else {
        player.inDebtForTurns = 0;
      }
    }
  });
}

function getCurrentPlayer() {
  return players[currentPlayerIndex];
}

function getPlayers(): Array<Player> {
  return players;
}

function getPieces(): Array<Piece> {
  return pieces;
}

function setPieces(updatedPieces: Array<Piece>) {
  pieces = updatedPieces;
}

function getItems(): Array<Item> {
  return items;
}

function addItem(item: Item) {
  items.push(item);
}

function setItems(updatedItems: Array<Item>) {
  items = updatedItems;
}

function getRoundCounter(): number {
  return roundCounter;
}

function increaseRoundCounter() {
  roundCounter++;
}

function getDeathCounter(): number {
  return deathCounter;
}

function increaseDeathCounter() {
  deathCounter++;
}

function getIsCaslting(): boolean {
  return isCastling;
}

function switchIsCastling() {
  isCastling = !isCastling;
}

function getIsFriendlyFire(): boolean {
  return isFriendlyFire;
}

function setIsFriendlyFire(_isFriendlyFire: boolean) {
  isFriendlyFire = _isFriendlyFire;
}

function getIsPieceKilled(): boolean {
  return isPieceKilled;
}

function setIsPieceKilled(_isPieceKilled: boolean) {
  isPieceKilled = _isPieceKilled;
}

function getFellOffTheBoardPiece(): Piece | undefined {
  return fellOffTheBoardPiece;
}

function setFellOffTheBoardPiece(_fellOffTheBoardPiece: Piece | undefined) {
  fellOffTheBoardPiece = _fellOffTheBoardPiece;
}

function endGame() {
  isGameFinished = true;
}

function changeItemPlacedRecently() {
  itemPlacedDownRecently = true;
}

function wasItemPlacedRecently(){
  return itemPlacedDownRecently;
}

export const game = {
  initialize: initializeGame,
  end: endGame,
  endTurn,
  getCurrentPlayer,
  switchIsCastling,
  getPlayers,
  getPieces,
  setPieces,
  getItems,
  setItems,
  addItem,
  getRoundCounter,
  increaseRoundCounter,
  getDeathCounter,
  increaseDeathCounter,
  getIsCaslting,
  getIsFriendlyFire,
  setIsFriendlyFire,
  getIsPieceKilled,
  setIsPieceKilled,
  getFellOffTheBoardPiece,
  setFellOffTheBoardPiece,
  changeItemPlacedRecently,
  wasItemPlacedRecently,
};
