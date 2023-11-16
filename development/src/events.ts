import { HEAVEN_BOARD, HELL_BOARD, OVERWORLD_BOARD } from './boards';

let draggedElement: HTMLElement;

let triggerOnAction: (
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  board: string,
) => void;
let triggerOnFallOffTheBoard: (
  draggedElement: HTMLElement,
  board: string,
) => void;

const OVERWORLD_BOARD_BUTTON = document.getElementById('board-overworld-button');
const HELL_BOARD_BUTTON = document.getElementById('board-hell-button');
const HEAVEN_BOARD_BUTTON = document.getElementById('board-heaven-button');

let triggerOnHighlight: (target: HTMLElement, shouldHighlight: boolean) => void;

export function initializeEventListeners() {
  const squares = document.querySelectorAll('.square');
  // Listen for mouse events
  squares.forEach((square) => {
    square.addEventListener('dragstart', onDragStart);
    square.addEventListener('dragover', onDragOver);
    square.addEventListener('drop', onDragDrop);
    square.addEventListener('mouseover', onMouseOver);
    square.addEventListener('mouseout', onMouseOut);
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

  let board = targetElement as HTMLElement;
  while (!board.classList.contains('board')) {
    board = board.parentNode as HTMLElement;
  }

  triggerOnAction(draggedElement, targetElement, board.id);
}

function onDragOver(event: Event) {
  event.preventDefault();
}

function onDragOffTheBoard(_: Event) {
  let board = draggedElement;
  while (!board.classList.contains('board')) {
    board = board.parentNode as HTMLElement;
  }

  triggerOnFallOffTheBoard(draggedElement, board.id);
}

function handleMouseEvents(event: Event, shouldHighlight: boolean) {
  const target = event.target as HTMLElement;
  triggerOnHighlight(target, shouldHighlight);
}

function onMouseOver(event: Event) {
  handleMouseEvents(event, true);
}

function onMouseOut(event: Event) {
  handleMouseEvents(event, false);
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

export function setOnFallOffTheBoard(
  _triggerOnFallOffTheBoard: (
    draggedElement: HTMLElement,
    board: string,
  ) => void,
) {
  triggerOnFallOffTheBoard = _triggerOnFallOffTheBoard;
}

export function setOnHighlight(
  _triggerOnHighlight: (target: HTMLElement, shouldHighlight: boolean) => void,
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
