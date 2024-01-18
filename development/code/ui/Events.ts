import { onPieceSelected } from '../LogicAdapter';
import { HEAVEN_BOARD_BUTTON_ID, HELL_BOARD_BUTTON_ID, OVERWORLD_BOARD_BUTTON_ID } from '../logic/Constants';
import { HEAVEN_BOARD, HELL_BOARD, OVERWORLD_BOARD } from './BoardManager';

let draggedElement: HTMLElement;

let triggerOnAction: (
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  board: string,
) => void;
let triggerOnFellOffTheBoard: (
  draggedElement: HTMLElement,
  board: string,
) => void;

const OVERWORLD_BOARD_BUTTON = document.getElementById(
  OVERWORLD_BOARD_BUTTON_ID,
);
const HELL_BOARD_BUTTON = document.getElementById(HELL_BOARD_BUTTON_ID);
const HEAVEN_BOARD_BUTTON = document.getElementById(HEAVEN_BOARD_BUTTON_ID);

let triggerOnHighlight: (target: HTMLElement, shouldAddHighlight: boolean, isMouseHighlight: boolean) => void;

export function initializeEventListeners() {
  const squares = document.querySelectorAll('.square');
  // Listen for mouse events
  squares.forEach(square => {
    square.addEventListener('dragstart', onDragStart);
    square.addEventListener('dragover', onDragOver);
    square.addEventListener('drop', onDragDrop);
    square.addEventListener('mouseover', onMouseOver);
    square.addEventListener('mouseout', onMouseOut);

    square.addEventListener('click', onMouseClick);
  });

  // Support pieces falling off the board
  document.body.addEventListener('dragover', onDragOver);
  document.body.addEventListener('drop', onDragOffTheBoard);

  // Listen for boards' buttons clicks
  OVERWORLD_BOARD_BUTTON?.addEventListener('click', handleButtonPress);
  HELL_BOARD_BUTTON?.addEventListener('click', handleButtonPress);
  HEAVEN_BOARD_BUTTON?.addEventListener('click', handleButtonPress);
}

function onDragStart(event: Event) {
  const targetElement = event.target as HTMLElement;
  if (targetElement.classList.contains('piece')) {
    draggedElement = event.target as HTMLElement;
  }
}

function onDragDrop(event: Event) {
  event.stopPropagation();
  let targetElement = event.target as HTMLElement;
  // Make sure target is not a resource
  while (targetElement.classList.contains('untargetable')) {
    targetElement = targetElement.parentNode as HTMLElement;
  }

  let boardElement = targetElement as HTMLElement;
  while (!boardElement.classList.contains('board')) {
    boardElement = boardElement.parentNode as HTMLElement;
  }

  triggerOnAction(draggedElement, targetElement, boardElement.id);
}

function onDragOver(event: Event) {
  event.preventDefault();
}

function onDragOffTheBoard(_: Event) {
  let boardElement = draggedElement;
  while (!boardElement.classList.contains('board')) {
    boardElement = boardElement.parentNode as HTMLElement;
  }

  triggerOnFellOffTheBoard(draggedElement, boardElement.id);
}

function handleMouseEvents(event: Event, shouldAddHighlight: boolean) {
  const targetElement = event.target as HTMLElement;
  triggerOnHighlight(targetElement, shouldAddHighlight, true);
}

function onMouseOver(event: Event) {
  handleMouseEvents(event, true);
}

function onMouseOut(event: Event) {
  handleMouseEvents(event, false);
}

function onMouseClick(event: Event) {
  let targetElement = event.target as HTMLElement;
  let boardElement = targetElement;

  // Make sure target is not a resource
  while (targetElement.classList.contains('untargetable')) {
    targetElement = targetElement.parentNode as HTMLElement;
  }

  if (!targetElement.classList.contains('piece')) return;

  while (!boardElement.classList.contains('board')) {
    boardElement = boardElement.parentNode as HTMLElement;
  }

  onPieceSelected(targetElement, boardElement.id);
}

export function setOnAction(
  _triggerOnAction: (
    draggedElement: HTMLElement,
    targetElement: HTMLElement,
    board: string,
  ) => void,
) {
  triggerOnAction = _triggerOnAction;
}

export function setOnFellOffTheBoard(
  _triggerOnFellOffTheBoard: (
    draggedElement: HTMLElement,
    boardId: string,
  ) => void,
) {
  triggerOnFellOffTheBoard = _triggerOnFellOffTheBoard;
}

export function setOnHighlight(
  _triggerOnHighlight: (target: HTMLElement, shouldAddHighlight: boolean, isMouseHighlight: boolean) => void,
) {
  triggerOnHighlight = _triggerOnHighlight;
}

function showBoard(boardId: string) {
  const boardElement = document.getElementById(boardId) as HTMLElement;

  OVERWORLD_BOARD.classList.add('collapsed');
  HELL_BOARD.classList.add('collapsed');
  HEAVEN_BOARD.classList.add('collapsed');

  boardElement.classList.remove('collapsed');
}

export function handleButtonPress(event: Event) {
  const buttonValue = (event.target as HTMLButtonElement).value;
  showBoard(buttonValue);
}
