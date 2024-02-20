import { game } from '../Game';
import { onPieceSelected, placeItemOnBoard, returnItemToInventory } from '../LogicAdapter';
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
  element.onmousedown = dragElementOnMouseDown;

  function dragElementOnMouseDown(event: MouseEvent) {
    event.preventDefault();

    const currentTurnPlayerColor = game.getCurrentPlayer().color.toLowerCase();
    const isElementOfCurrentPlayer = element.classList.contains(currentTurnPlayerColor);
    const isItemElement = element.classList.contains('item');
    if (!(isElementOfCurrentPlayer || isItemElement)) return;

    endMouseX = event.clientX;
    endMouseY = event.clientY;
    document.onmousemove = elementDrag;
    document.onmouseup = stopElementDrag;
  }

  function elementDrag(event: MouseEvent) {
    event.preventDefault();
    element.style.marginTop = '0';

    triggerOnHighlight(element, false, true);
    draggedElement = element;

    startMouseX = endMouseX - event.clientX;
    startMouseY = endMouseY - event.clientY;

    endMouseX = event.clientX;
    endMouseY = event.clientY;

    element.style.left = (element.offsetLeft - startMouseX) + 'px';
    element.style.top = (element.offsetTop - startMouseY) + 'px';
  }

  function stopElementDrag(_: MouseEvent) {
    document.onmouseup = null;
    document.onmousemove = null;
    
    const initialElement = draggedElement as HTMLElement;
    if (!initialElement) return;

    let parentContainer = initialElement.parentElement ?? undefined;
    const isParentContainerABoard = parentContainer?.classList.contains('board');
    const isParentContainerAnInventory = parentContainer?.classList.contains('player-inventory');
    while (parentContainer && (!isParentContainerABoard || isParentContainerAnInventory)) {
      parentContainer = parentContainer.parentElement ?? undefined;
    }

    if (!parentContainer) return;

    const elementXPosition = endMouseX - startMouseX;
    const elementYPosition = endMouseY - startMouseY;

    const droppedOnElements = document.elementsFromPoint(
      elementXPosition,
      elementYPosition,
    ) as Array<HTMLElement>;
    
    const droppedOnElement = droppedOnElements.filter(element => {
      return (element.classList.contains('square') ||
        element.classList.contains('item') ||
        element.classList.contains('piece') ) && element !== draggedElement;
    })[0];
      
    if (draggedElement.classList.contains('item') && !placeItemOnBoard(draggedElement, droppedOnElement)) {
      returnItemToInventory(draggedElement);
    } else if (!droppedOnElement) {
      triggerOnFellOffTheBoard(draggedElement, parentContainer.id);
    } else {
      triggerOnAction(draggedElement, droppedOnElement, parentContainer.id);
    }
  }
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
