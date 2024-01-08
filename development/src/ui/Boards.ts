import { ChessBoard } from './Board';
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
  OVERWORLD_BOARD_BUTTON_ID,
  OVERWORLD_BOARD_ID,
} from '../logic/Constants';
import { Item } from '../logic/items/Items';
import { Piece } from '../logic/pieces/Pieces';
import { Square } from '../logic/pieces/PiecesHelpers';

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
const OVERWORLD_BOARD_BUTTON = document.getElementById(
  OVERWORLD_BOARD_BUTTON_ID,
) as HTMLElement;
const HELL_BOARD_BUTTON = document.getElementById(
  HELL_BOARD_BUTTON_ID,
) as HTMLElement;
const HEAVEN_BOARD_BUTTON = document.getElementById(
  HEAVEN_BOARD_BUTTON_ID,
) as HTMLElement;

export function initializeBoards() {
  overworld = new ChessBoard(
    OVERWORLD_BOARD_ID,
    OVERWORLD_BOARD,
    OVERWORLD_BOARD_BUTTON,
    LIGHT_OVERWORLD_SQUARE_COLOR,
    DARK_OVERWORLD_SQUARE_COLOR,
  );
  hell = new ChessBoard(
    HELL_BOARD_ID,
    HELL_BOARD,
    HELL_BOARD_BUTTON,
    LIGHT_HELL_SQUARE_COLOR,
    DARK_HELL_SQUARE_COLOR,
  );
  heaven = new ChessBoard(
    HEAVEN_BOARD_ID,
    HEAVEN_BOARD,
    HEAVEN_BOARD_BUTTON,
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

function getBoardbyId(boardId: string): ChessBoard {
  switch (boardId) {
    case HELL_BOARD_ID:
      return hell;
    case HEAVEN_BOARD_ID:
      return heaven;
    default:
      return overworld;
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
  const board = getBoardbyId(draggedPiece.position.boardId);
  board.movePieceOnBoard(draggedPiece, targetSquare);
}

export function destroyPieceOnBoard(targetPiece: Piece) {
  const board = getBoardbyId(targetPiece.position.boardId);
  board.destroyPieceOnBoard(targetPiece);
}

export function destroyItemOnBoard(targetItem: Item) {
  const board = getBoardbyId(targetItem.position.boardId);
  board.destroyItemOnBoard(targetItem);
}

export function spawnPieceOnBoard(piece: Piece) {
  const board = getBoardbyId(piece.position.boardId);
  board.spawnPieceOnBoard(piece);
  board.boardButtonElement.classList.remove('collapsed');
}

export function spawnItemOnBoard(item: Item) {
  const board = getBoardbyId(item.position.boardId);
  board.spawnItemOnBoard(item);
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


