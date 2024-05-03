import { ChessBoard } from './Board';
import {
  BOARD_WIDTH,
  BOTTOM_NOTATION_ID,
  DARK_HEAVEN_SQUARE_COLOR,
  DARK_HELL_SQUARE_COLOR,
  DARK_OVERWORLD_SQUARE_COLOR,
  HIGHLIGHT_SQUARE_COLOR,
  HEAVEN_BOARD_BUTTON_ELEMENT_ID,
  HEAVEN_BOARD_ID,
  HELL_BOARD_BUTTON_ELEMENT_ID,
  HELL_BOARD_ID,
  LEFT_NOTATION_ID,
  LIGHT_HEAVEN_SQUARE_COLOR,
  LIGHT_HELL_SQUARE_COLOR,
  LIGHT_OVERWORLD_SQUARE_COLOR,
  NOTATIONS_LETTERS,
  NOTATIONS_NUMBERS,
  OVERWORLD_BOARD_BUTTON_ELEMENT_ID,
  OVERWORLD_BOARD_ID,
  HIGHLIGHT_LEGAL_MOVE,
} from '../Constants';
import { BaseItem } from '../logic/items/abstract/Item';
import { BasePiece } from '../logic/pieces/abstract/BasePiece';

let overworldBoard: ChessBoard;
let hellBoard: ChessBoard;
let heavenBoard: ChessBoard;

export const OVERWORLD_BOARD = document.getElementById(
  OVERWORLD_BOARD_ID,
) as HTMLElement;
export const HELL_BOARD = document.getElementById(HELL_BOARD_ID) as HTMLElement;
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
  OVERWORLD_BOARD_BUTTON_ELEMENT_ID,
) as HTMLElement;
const HELL_BOARD_BUTTON = document.getElementById(
  HELL_BOARD_BUTTON_ELEMENT_ID,
) as HTMLElement;
const HEAVEN_BOARD_BUTTON = document.getElementById(
  HEAVEN_BOARD_BUTTON_ELEMENT_ID,
) as HTMLElement;

export function initializeBoards() {
  overworldBoard = new ChessBoard(
    OVERWORLD_BOARD_ID,
    OVERWORLD_BOARD,
    OVERWORLD_BOARD_BUTTON,
    LIGHT_OVERWORLD_SQUARE_COLOR,
    DARK_OVERWORLD_SQUARE_COLOR,
  );

  hellBoard = new ChessBoard(
    HELL_BOARD_ID,
    HELL_BOARD,
    HELL_BOARD_BUTTON,
    LIGHT_HELL_SQUARE_COLOR,
    DARK_HELL_SQUARE_COLOR,
  );

  heavenBoard = new ChessBoard(
    HEAVEN_BOARD_ID,
    HEAVEN_BOARD,
    HEAVEN_BOARD_BUTTON,
    LIGHT_HEAVEN_SQUARE_COLOR,
    DARK_HEAVEN_SQUARE_COLOR,
  );

  generateNotations();
}

export function generateNotations() {
  for (let index = 0; index < BOARD_WIDTH; index++) {
    createNotationGraphics(NOTATIONS_NUMBERS[index]);
    createNotationGraphics(NOTATIONS_LETTERS[index]);
  }
}

function getBoardbyId(boardId: string): ChessBoard {
  switch (boardId) {
    case HELL_BOARD_ID:
      return hellBoard;
    case HEAVEN_BOARD_ID:
      return heavenBoard;
    default:
      return overworldBoard;
  }
}

export function getAllSquareElements(boardId: string): Array<HTMLElement> {
  const board = getBoardbyId(boardId);
  const boardElement = board.boardElement;

  const squares = boardElement.querySelectorAll('[square-id]');
  return Array.from(squares) as Array<HTMLElement>;
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

export function getSquareElementById(
  squareId: string,
  boardId: string,
): HTMLElement | undefined {
  const board = getBoardbyId(boardId);
  return board.boardElement.querySelector(
    `[square-id="${squareId}"]`,
  ) as HTMLElement;
}

export function getPieceElementBySquareId(
  squareId: string,
  boardId: string,
): HTMLElement | undefined {
  const squareElement = getSquareElementById(squareId, boardId);
  const pieceElement = squareElement?.firstElementChild as HTMLElement;
  if (pieceElement.classList.contains('piece')) {
    return pieceElement;
  }
}

export function moveElementOnBoard(
  boardId: string,
  originSquareId: string,
  targetSquareId: string,
) {
  const targetSquareElement = getSquareElementById(targetSquareId, boardId);
  const originSquareElement = getSquareElementById(originSquareId, boardId);
  const movedElement = originSquareElement?.firstElementChild as HTMLElement;

  if (targetSquareElement && originSquareElement) {
    const board = getBoardbyId(boardId);
    board.moveElementOnBoard(movedElement, targetSquareElement);
  }
}

export function destroyElementOnBoard(
  targetSquareId: string,
  boardId: string,
  fadeDirection = 0,
) {
  const board = getBoardbyId(boardId);

  const elementSquareElement = board.boardElement.querySelector(`
    [square-id="${targetSquareId}"]
  `) as HTMLElement;
  // Get first element without the class 'destroyed'.
  // This is necessary because there is a short delay when an element is destroyed (for the fade effect).
  const element = elementSquareElement.querySelector(
    'div:not(.destroyed)',
  ) as HTMLElement;
  if (!element) return;

  board.destroyElementOnBoard(element, fadeDirection);
}

export function destroyElementOnPiece(targetSquareId: string, boardId: string) {
  const board = getBoardbyId(boardId);

  const elementSquareElement = board.boardElement.querySelector(`
    [square-id="${targetSquareId}"]
  `) as HTMLElement;
  const pieceElement = elementSquareElement?.firstElementChild as HTMLElement;
  if (!pieceElement) return;

  const element = pieceElement.firstElementChild as HTMLElement;
  if (!element) return;

  board.destroyElementOnBoard(element);
}

export function spawnPieceElementOnBoard(
  piece: BasePiece,
  targetSquareId: string,
) {
  if (!piece.position) return;
  const board = getBoardbyId(piece.position.boardId);

  const squareElement = board.boardElement.querySelectorAll(`
    [square-id="${targetSquareId}"]
  `)[0] as HTMLElement;

  const pieceElement = board.createPieceElement(piece);
  board.spawnElementOnBoard(pieceElement, squareElement);

  board.boardButtonElement.classList.remove('disabled');
}

export function spawnItemElementOnBoard(
  item: BaseItem,
  targetSquareId: string,
) {
  if (!item.position) return;
  const board = getBoardbyId(item.position.boardId);

  const squareElement = board.boardElement.querySelectorAll(`
    [square-id="${targetSquareId}"]
  `)[0] as HTMLElement;

  const itemElement = board.createItemElement(item);
  board.spawnElementOnBoard(itemElement, squareElement);
}

export function spawnItemOnChildElement(
  item: BaseItem,
  targetSquareId: string,
  isUntargetable = false,
) {
  if (!item.position) return;
  const board = getBoardbyId(item.position.boardId);

  const squareElement = board.boardElement.querySelectorAll(`
    [square-id="${targetSquareId}"]
  `)[0] as HTMLElement;

  const childElement = squareElement.firstElementChild as HTMLElement;

  const itemElement = board.createItemElement(item);
  if (isUntargetable) {
    itemElement.classList.remove('item');
    itemElement.classList.add('untargetable-item');
  }
  childElement.insertBefore(itemElement, childElement.firstElementChild);
}

function findSquareElement(element: HTMLElement): HTMLElement | undefined {
  while (element && !element.classList.contains('square')) {
    element = element.parentElement as HTMLElement;
  }

  return element && element.classList.contains('square') ? element : undefined;
}

function highlightSquare(
  targetElement: HTMLElement,
  shouldAddHighlight: boolean,
) {
  const squareElement = findSquareElement(targetElement);
  if (!squareElement) return;

  if (shouldAddHighlight) {
    targetElement.classList.add(HIGHLIGHT_SQUARE_COLOR);
  } else {
    targetElement.classList.remove(HIGHLIGHT_SQUARE_COLOR);
  }
}

export function highlightLastMove(
  originSquareElement: HTMLElement,
  targetSquareElement: HTMLElement,
  boardId: string,
) {
  const allSquareElements = getAllSquareElements(boardId);
  for (const squareElement of allSquareElements) {
    highlightSquare(squareElement, false);
  }

  highlightSquare(originSquareElement, true);
  highlightSquare(targetSquareElement, true);

  // Remove all legal moves highlights
  for (const squareElement of allSquareElements) {
    highlightLegalMove(squareElement, false);
  }
}

export function highlightLegalMove(
  targetElement: HTMLElement,
  shouldAddHighlight: boolean,
) {
  const squareElement = findSquareElement(targetElement);
  if (!squareElement) return;

  if (shouldAddHighlight) {
    targetElement.classList.add(HIGHLIGHT_LEGAL_MOVE);
  } else {
    targetElement.classList.remove(HIGHLIGHT_LEGAL_MOVE);
  }
}
