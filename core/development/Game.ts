import {
  switchInventory,
  renderScreen,
  destroyPieceOnBoard,
  spawnPieceOnBoard,
} from './LogicAdapter';
import { BOARD_WIDTH, OVERWORLD_BOARD_ID, VOID_BOARD_ID } from './Constants';
import { Player, PlayerColors } from './logic/players/Player';
import { Item } from './logic/items/Items';
import { Bishop } from './logic/pieces/Bishop';
import { King } from './logic/pieces/King';
import { Knight } from './logic/pieces/Knight';
import { Pawn } from './logic/pieces/Pawn';
import { Piece } from './logic/pieces/Piece';
import { Queen } from './logic/pieces/Queen';
import { Rook } from './logic/pieces/Rook';
import { RulesManager } from './logic/rules/RulesManager';
import { showWinningAlert } from './ui/Screen';
import { Logger } from './ui/logs/Logger';
import { initializeInventoryUI } from './ui/InventoriesUI';
import { addItemToShop } from './ui/ShopUI';
import { Shop } from './logic/items/Shop';

export const shop = new Shop();

let rulesManager: RulesManager;
const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);
const players: Array<Player> = [whitePlayer, blackPlayer];
let pieces: Array<Piece> = [
  new Rook(blackPlayer, { coordinates: [0, 0], boardId: OVERWORLD_BOARD_ID }),
  new Knight(blackPlayer, { coordinates: [1, 0], boardId: OVERWORLD_BOARD_ID }),
  new Bishop(blackPlayer, { coordinates: [2, 0], boardId: OVERWORLD_BOARD_ID }),
  new Queen(blackPlayer, { coordinates: [3, 0], boardId: OVERWORLD_BOARD_ID }),
  new King(blackPlayer, { coordinates: [4, 0], boardId: OVERWORLD_BOARD_ID }),
  new Bishop(blackPlayer, { coordinates: [5, 0], boardId: OVERWORLD_BOARD_ID }),
  new Knight(blackPlayer, { coordinates: [6, 0], boardId: OVERWORLD_BOARD_ID }),
  new Rook(blackPlayer, { coordinates: [7, 0], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [0, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [1, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [2, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [3, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [4, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [5, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [6, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(blackPlayer, { coordinates: [7, 1], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [0, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [1, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [2, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [3, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [4, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [5, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [6, 6], boardId: OVERWORLD_BOARD_ID }),
  new Pawn(whitePlayer, { coordinates: [7, 6], boardId: OVERWORLD_BOARD_ID }),
  new Rook(whitePlayer, { coordinates: [0, 7], boardId: OVERWORLD_BOARD_ID }),
  new Knight(whitePlayer, { coordinates: [1, 7], boardId: OVERWORLD_BOARD_ID }),
  new Bishop(whitePlayer, { coordinates: [2, 7], boardId: OVERWORLD_BOARD_ID }),
  new Queen(whitePlayer, { coordinates: [3, 7], boardId: OVERWORLD_BOARD_ID }),
  new King(whitePlayer, { coordinates: [4, 7], boardId: OVERWORLD_BOARD_ID }),
  new Bishop(whitePlayer, { coordinates: [5, 7], boardId: OVERWORLD_BOARD_ID }),
  new Knight(whitePlayer, { coordinates: [6, 7], boardId: OVERWORLD_BOARD_ID }),
  new Rook(whitePlayer, { coordinates: [7, 7], boardId: OVERWORLD_BOARD_ID }),
];
let items: Array<Item> = [];
let currentPlayerIndex = 0;
let turnCounter = 0;
let roundCounter = 1;
let deathCounter = 0;
let isCastling = false;
let isFriendlyFire = false;
let killerPiece: Piece | undefined = undefined;
let wasItemPlacedThisTurn = false;
let fellOffTheBoardPiece: Piece | undefined;
let movesLeft = 0;

function initializeGame() {
  rulesManager = new RulesManager();

  players.forEach((player) => {
    initializeInventoryUI(player.color);
  });

  shop.items.forEach((item) => {
    addItemToShop(item);
  });
}

function endMove(canRecover = true) {
  rulesManager.activeRules.forEach((rule) => {
    rule.trigger();
  });

  Logger.logMessages();

  movesLeft--;
  if (!canRecover) movesLeft = 0;
  if (movesLeft > 0) return;

  checkForUpgradeablePawns();
  resetVariables();
  endTurn();
}

function checkForUpgradeablePawns() {
  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index];
    if (piece instanceof Pawn && piece.position) {
      const whitePawnReachedEndOfBoard =
        piece.player === whitePlayer && piece.position.coordinates[1] === 0;
      const blackPawnReachedEndOfBoard =
        piece.player === blackPlayer &&
        piece.position.coordinates[1] === BOARD_WIDTH - 1;

      if (whitePawnReachedEndOfBoard || blackPawnReachedEndOfBoard) {
        destroyPieceOnBoard(piece);
        pieces.splice(index, 1);

        const newQueen = new Queen(piece.player, piece.position);
        spawnPieceOnBoard(newQueen);
        pieces.splice(index, 0, newQueen);
      }
    }
  }
}

function resetVariables() {
  isCastling = false;
  isFriendlyFire = false;
  killerPiece = undefined;
  fellOffTheBoardPiece = undefined;
  wasItemPlacedThisTurn = false;
  movesLeft = 0;

  pieces.forEach((piece) => {
    if (piece.player !== getCurrentPlayer() && piece instanceof Pawn) {
      piece.possibleEnPassantPositions = undefined;
      piece.isInitialDoubleStep = false;
      piece.diagonalAttackPosition = undefined;
    }
  });
}

function endTurn() {
  updatePlayerDetails();

  currentPlayerIndex =
    currentPlayerIndex + 1 < players.length ? currentPlayerIndex + 1 : 0;
  turnCounter++;
  if (turnCounter % players.length === 0) {
    turnCounter = 0;
    roundCounter++;
  }

  players.forEach((player) => {
    switchInventory(player);
  });

  renderScreen();
}

function updatePlayerDetails() {
  game.getPlayers().forEach((player) => {
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

function getKillerPiece(): Piece | undefined {
  return killerPiece;
}

function setKillerPiece(_killerPiece: Piece) {
  killerPiece = _killerPiece;
}

function getFellOffTheBoardPiece(): Piece | undefined {
  return fellOffTheBoardPiece;
}

function setFellOffTheBoardPiece(_fellOffTheBoardPiece: Piece | undefined) {
  fellOffTheBoardPiece = _fellOffTheBoardPiece;
}

function getMovesLeft() {
  return movesLeft;
}

function setMovesLeft(moves: number) {
  movesLeft = moves;
}

function endGame() {
  const livingKingPlayer = pieces.filter((piece) => piece instanceof King)[0]
    .player;

  showWinningAlert(livingKingPlayer.color);
}

function switchWasItemPlacedThisTurn() {
  wasItemPlacedThisTurn = true;
}

function getWasItemPlacedThisTurn() {
  return wasItemPlacedThisTurn;
}

export const game = {
  initialize: initializeGame,
  end: endGame,
  endMove,
  getMovesLeft,
  setMovesLeft,
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
  getKillerPiece,
  setKillerPiece,
  getFellOffTheBoardPiece,
  setFellOffTheBoardPiece,
  switchWasItemPlacedThisTurn,
  getWasItemPlacedThisTurn,
};
