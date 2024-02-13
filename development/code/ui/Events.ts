import { game } from '../Game';
import { onPieceSelected, placeItemOnBoard } from '../LogicAdapter';
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

let triggerOnHighlight: (
  target: HTMLElement,
  shouldAddHighlight: boolean,
  isMouseHighlight: boolean,
) => void;

export function initializeEventListeners() {
  const squares = document.querySelectorAll('.square');
  // Listen for mouse events
  squares.forEach(square => {
    square.addEventListener('mouseover', onMouseOver);
    square.addEventListener('mouseout', onMouseOut);
  });

  const pieces = document.querySelectorAll('.piece');
  pieces.forEach(pieceElement => {
    pieceElement.addEventListener('click', onMouseClick);
    dragElement(pieceElement as HTMLElement);
  });

  // Listen for boards' buttons clicks
  OVERWORLD_BOARD_BUTTON?.addEventListener('click', handleButtonPress);
  HELL_BOARD_BUTTON?.addEventListener('click', handleButtonPress);
  HEAVEN_BOARD_BUTTON?.addEventListener('click', handleButtonPress);
}

export function dragElement(element: HTMLElement) {
  let startMouseX = 0;
  let startMouseY = 0;
  let endMouseX = 0;
  let endMouseY = 0;
  element.onmousedown = dragOnMouseDown;

  function dragOnMouseDown(event: MouseEvent) {
    event.preventDefault();

    const currentTurnPlayerColor = game.getCurrentPlayer().color.toLowerCase();
    if (!element.classList.contains(currentTurnPlayerColor)) return;
    endMouseX = event.clientX;
    endMouseY = event.clientY;
    document.onmousemove = elementDrag;
    document.onmouseup = stopElementDrag;
  }

  function elementDrag(event: MouseEvent) {
    event.preventDefault();
    console.log('1');

    triggerOnHighlight(element, false, true);
    draggedElement = element;

    startMouseX = endMouseX - event.clientX;
    startMouseY = endMouseY - event.clientY;
    endMouseX = event.clientX;
    endMouseY = event.clientY;
    console.log('2');
    element.style.left = (element.offsetLeft - startMouseX) + 'px';
    element.style.top = (element.offsetTop - startMouseY) + 'px';
  }

  function stopElementDrag(_: MouseEvent) {
    document.onmouseup = null;
    document.onmousemove = null;
    console.log('3');
    const initialElement = draggedElement as HTMLElement;
    if (!initialElement) return;

    let boardElement = initialElement.parentElement ?? undefined;
    while (boardElement && !(boardElement.classList.contains('board') || boardElement.classList.contains('player-inventory'))) {
      boardElement = boardElement.parentElement ?? undefined;
    }

    if (!boardElement) return;
    console.log('4');
    const elementXPosition = endMouseX - startMouseX;
    const elementYPosition = endMouseY - startMouseY;
    const droppedOnElements = document.elementsFromPoint(
      elementXPosition,
      elementYPosition,
    ) as Array<HTMLElement>;
    const droppedOnElement = droppedOnElements.filter(element => {
      console.log(element);
      return (element.classList.contains('square') ||
        element.classList.contains('item') ||
        element.classList.contains('piece') ) && element !== draggedElement;
    })[0];
    console.log(droppedOnElement);

    if (draggedElement.id === 'trap') {
      placeItemOnBoard(draggedElement, droppedOnElement);
    }
    else if (droppedOnElement === undefined) {
      console.log('87');
      triggerOnFellOffTheBoard(draggedElement, boardElement.id);
    } else {
      console.log('5');
      triggerOnAction(draggedElement, droppedOnElement, boardElement.id);
    }
  }
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
  let pieceElement = event.target as HTMLElement;
  // Make sure target is not a resource
  while (pieceElement.classList.contains('untargetable')) {
    pieceElement = pieceElement.parentElement as HTMLElement;
  }

  let boardElement= pieceElement.parentElement ?? undefined;

  while (!boardElement?.classList.contains('board')) {
    boardElement = boardElement?.parentElement ?? undefined;
  }

  onPieceSelected(pieceElement, boardElement.id);
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
  _triggerOnHighlight: (
    target: HTMLElement,
    shouldAddHighlight: boolean,
    isMouseHighlight: boolean,
  ) => void,
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
