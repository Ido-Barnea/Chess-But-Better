import { ChessBoard } from './board';
import { Item } from './items';
import { Piece, Square } from './pieces';

let overworld: ChessBoard;
let hell: ChessBoard;
let heaven: ChessBoard;

export const OVERWORLD_BOARD_ID = 'board-overworld';
export const HELL_BOARD_ID = 'board-hell';
export const HEAVEN_BOARD_ID = 'board-heaven';

export const OVERWORLD_BOARD = document.getElementById(
  OVERWORLD_BOARD_ID,
) as HTMLElement;
export const HELL_BOARD = document.getElementById(HELL_BOARD_ID) as HTMLElement;
export const HEAVEN_BOARD = document.getElementById(
  HEAVEN_BOARD_ID,
) as HTMLElement;

const HELL_BOARD_BUTTON = document.getElementById(
  'board-hell-button',
) as HTMLElement;
const HEAVEN_BOARD_BUTTON = document.getElementById(
  'board-heaven-button',
) as HTMLElement;

const lightOverworldSquareColor = 'beige-background';
const darkOverworldSquareColor = 'brown-background';
const lightHellSquareColor = 'dark-orange-background';
const darkHellSquareColor = 'dark-red-background';
const lightHeavenSquareColor = 'water-background';
const darkHeavenSquareColor = 'blue-background';

export function initializeBoards() {
  overworld = new ChessBoard(
    OVERWORLD_BOARD,
    lightOverworldSquareColor,
    darkOverworldSquareColor,
  );
  hell = new ChessBoard(HELL_BOARD, lightHellSquareColor, darkHellSquareColor);
  heaven = new ChessBoard(
    HEAVEN_BOARD,
    lightHeavenSquareColor,
    darkHeavenSquareColor,
  );
}

export function movePieceOnBoard(draggedPiece: Piece, targetSquare: Square) {
  switch (draggedPiece.position.board) {
    case OVERWORLD_BOARD_ID:
      overworld.movePieceOnBoard(draggedPiece, targetSquare);
      break;
    case HELL_BOARD_ID:
      hell.movePieceOnBoard(draggedPiece, targetSquare);
      break;
    case HEAVEN_BOARD_ID:
      heaven.movePieceOnBoard(draggedPiece, targetSquare);
  }
}

export function destroyPieceOnBoard(targetPiece: Piece) {
  switch (targetPiece.position.board) {
    case OVERWORLD_BOARD_ID:
      overworld.destroyPieceOnBoard(targetPiece);
      break;
    case HELL_BOARD_ID:
      hell.destroyPieceOnBoard(targetPiece);
      break;
    case HEAVEN_BOARD_ID:
      heaven.destroyPieceOnBoard(targetPiece);
      break;
  }
}

export function destroyItemOnBoard(targetItem: Item) {
  switch (targetItem.position.board) {
    case OVERWORLD_BOARD_ID:
      overworld.destroyItemOnBoard(targetItem);
      break;
    case HELL_BOARD_ID:
      hell.destroyItemOnBoard(targetItem);
      break;
    case HEAVEN_BOARD_ID:
      heaven.destroyItemOnBoard(targetItem);
      break;
  }
}

export function spawnPieceOnBoard(piece: Piece) {
  switch (piece.position.board) {
    case HELL_BOARD_ID:
      hell.spawnPieceOnBoard(piece);
      HELL_BOARD_BUTTON.classList.remove('collapsed');
      break;
    case HEAVEN_BOARD_ID:
      heaven.spawnPieceOnBoard(piece);
      HEAVEN_BOARD_BUTTON.classList.remove('collapsed');
      break;
    default:
      return;
  }
}

export function spawnItemOnBoard(item: Item) {
  switch (item.position.board) {
    case OVERWORLD_BOARD_ID:
      overworld.spawnItemOnBoard(item);
      break;
    case HELL_BOARD_ID:
      hell.spawnItemOnBoard(item);
      break;
    case HEAVEN_BOARD_ID:
      heaven.spawnItemOnBoard(item);
      break;
    default:
      return;
  }
}

export function highlightSquare(target: HTMLElement, shouldHighlight: boolean) {
  while (!target.classList.contains('square')) {
    target = target.parentNode as HTMLElement;
  }
  if (target.classList.contains('square')) {
    if (shouldHighlight) {
      target.classList.add('light-gray-background');
    } else {
      target.classList.remove('light-gray-background');
    }
  }
}
