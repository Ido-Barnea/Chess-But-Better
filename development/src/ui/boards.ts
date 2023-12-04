import { ChessBoard } from './board';
import {
  BOARD_WIDTH,
  BOTTOM_NOTATION_ID,
  DARK_HEAVEN_SQUARE_COLOR,
  DARK_HELL_SQUARE_COLOR,
  DARK_OVERWORLD_SQUARE_COLOR,
  GRAY_SQUARE_COLOR,
  HEAVEN_BOARD_BUTTON_ID,
  HEAVEN_BOARD_ID,
  HELL_BOARD_BUTTON_ID,
  HELL_BOARD_ID,
  LEFT_NOTATION_ID,
  LIGHT_HEAVEN_SQUARE_COLOR,
  LIGHT_HELL_SQUARE_COLOR,
  LIGHT_OVERWORLD_SQUARE_COLOR,
  NOTATIONS_LETTERS,
  NOTATIONS_NUMBERS,
  OVERWORLD_BOARD_ID,
} from '../logic/constants';
import { Item } from '../logic/items';
import { Piece, Square } from '../logic/pieces';

let overworld: ChessBoard;
let hell: ChessBoard;
let heaven: ChessBoard;

export const OVERWORLD_BOARD = document.getElementById(
  OVERWORLD_BOARD_ID,
) as HTMLElement;
export const HELL_BOARD = document.getElementById(
  HELL_BOARD_ID,
) as HTMLElement;
export const HEAVEN_BOARD = document.getElementById(
  HEAVEN_BOARD_ID,
) as HTMLElement;
export const BOTTOM_NOTATION_CONTAINER = document.getElementById(
  BOTTOM_NOTATION_ID,
) as HTMLElement;
export const LEFT_NOTATION_CONTAINER = document.getElementById(
  LEFT_NOTATION_ID,
) as HTMLElement;
const HELL_BOARD_BUTTON = document.getElementById(
  HELL_BOARD_BUTTON_ID,
) as HTMLElement;
const HEAVEN_BOARD_BUTTON = document.getElementById(
  HEAVEN_BOARD_BUTTON_ID,
) as HTMLElement;

export function initializeBoards() {
  overworld = new ChessBoard(
    OVERWORLD_BOARD,
    LIGHT_OVERWORLD_SQUARE_COLOR,
    DARK_OVERWORLD_SQUARE_COLOR,
  );
  hell = new ChessBoard(
    HELL_BOARD,
    LIGHT_HELL_SQUARE_COLOR,
    DARK_HELL_SQUARE_COLOR,
  );
  heaven = new ChessBoard(
    HEAVEN_BOARD,
    LIGHT_HEAVEN_SQUARE_COLOR,
    DARK_HEAVEN_SQUARE_COLOR,
  );
  generateNotations();
}

export function generateNotations(){
  for (let index = 0; index < BOARD_WIDTH; index++) {
    createNotationGraphics(NOTATIONS_NUMBERS[index]);
    createNotationGraphics(NOTATIONS_LETTERS[index]);
  }
}


export function createNotationGraphics(notation: string) {
  const notationElement = document.createElement('p');
  notationElement.classList.add('notation');
  notationElement.innerHTML = notation;
  if (NOTATIONS_LETTERS.includes(notation)) {
    notationElement.classList.add('letter');
    BOTTOM_NOTATION_CONTAINER.appendChild(notationElement);
  } else {
    notationElement.classList.add('number');
    LEFT_NOTATION_CONTAINER.appendChild(notationElement);
  }
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
      target.classList.add(GRAY_SQUARE_COLOR);
    } else {
      target.classList.remove(GRAY_SQUARE_COLOR);
    }
  }
}


