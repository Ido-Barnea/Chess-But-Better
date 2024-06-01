import { game } from '../Game';
import {
  buyItem,
  onPieceSelected,
  canPlaceItemOnBoard,
  returnItemToInventory,
  removeAllHighlights,
  unicornAttackAttempt,
} from '../LogicAdapter';
import {
  HEAVEN_BOARD_BUTTON_ELEMENT_ID,
  HEAVEN_BOARD_ID,
  HELL_BOARD_BUTTON_ELEMENT_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_BUTTON_ELEMENT_ID,
  OVERWORLD_BOARD_ID,
} from '../Constants';
import { HEAVEN_BOARD, HELL_BOARD, OVERWORLD_BOARD } from './BoardManager';
import { hideUnicornAttackButton } from './Screen';

const MOVEMENT_TO_CLICK_THRESHOLD = 10;

let draggedElement: HTMLElement | undefined;

let selectedPieceElement: HTMLElement | undefined;

let attackingUnicorn: HTMLElement | undefined;

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
  OVERWORLD_BOARD_BUTTON_ELEMENT_ID,
);
const HELL_BOARD_BUTTON = document.getElementById(HELL_BOARD_BUTTON_ELEMENT_ID);
const HEAVEN_BOARD_BUTTON = document.getElementById(
  HEAVEN_BOARD_BUTTON_ELEMENT_ID,
);

const SHOP_UPGRADE_SWAPPER = document.getElementById('shop-upgrade-swapper');
const SHOP_CONTAINER = document.getElementById('shop-container');
const UPGRADES_CONTAINER = document.getElementById('piece-upgrades-container');

const UNICORN_ATTACK_BUTTON = document.getElementById('unicorn-attack');

export function initializeEventListeners() {
  const pieces = document.querySelectorAll('.piece');
  pieces.forEach((pieceElement) => {
    pieceElement.addEventListener('mousedown', onPieceMouseDown);
    pieceElement.addEventListener('click', onPieceMouseClick);
  });

  OVERWORLD_BOARD_BUTTON?.addEventListener('click', handleBoardButtonPress);
  HELL_BOARD_BUTTON?.addEventListener('click', handleBoardButtonPress);
  HEAVEN_BOARD_BUTTON?.addEventListener('click', handleBoardButtonPress);

  UNICORN_ATTACK_BUTTON?.addEventListener(
    'click',
    onUnicornAttackButtonPressed,
  );

  SHOP_UPGRADE_SWAPPER?.addEventListener('change', swapShopAndUpgrade);

  document.addEventListener('click', onClickOnScreen);
}

function onPieceMouseDown(event: Event) {
  event.preventDefault();

  const element = event.target as HTMLElement;
  // Prevent dragging if the user clicked on an untargetable area
  if (element.classList.contains('untargetable')) {
    return;
  }

  initializeDraggingListeners(element);
}

export function initializeDraggingListeners(element: HTMLElement) {
  let startMouseX = 0;
  let startMouseY = 0;
  let endMouseX = 0;
  let endMouseY = 0;

  let originalMouseX = 0;
  let originalMouseY = 0;
  let isDragging = false;

  element.onmousedown = dragElementOnMouseDown;

  function dragElementOnMouseDown(event: MouseEvent) {
    event.preventDefault();

    const currentTurnPlayerColor = game
      .getPlayersTurnSwitcher()
      .getCurrentPlayer()
      .color;
    const isElementOfCurrentPlayer = element.classList.contains(
      currentTurnPlayerColor,
    );
    const isInventoryItemElement = element.classList.contains('inventory-item');
    const isBoardItemElement = element.classList.contains('item');
    if (!isElementOfCurrentPlayer && !isInventoryItemElement) return;
    if (isBoardItemElement) return;

    isDragging = false; // Reset dragging flag
    draggedElement = element;

    originalMouseX = event.clientX;
    originalMouseY = event.clientY;

    endMouseX = event.clientX;
    endMouseY = event.clientY;

    document.onmousemove = elementDrag;
    document.onmouseup = stopElementDrag;
  }

  function elementDrag(event: MouseEvent) {
    event.preventDefault();

    const distanceX = Math.abs(event.clientX - originalMouseX);
    const distanceY = Math.abs(event.clientY - originalMouseY);

    if (
      distanceX > MOVEMENT_TO_CLICK_THRESHOLD ||
      distanceY > MOVEMENT_TO_CLICK_THRESHOLD
    ) {
      // If the mouse moves more than MOVEMENT_TO_CLICK_THRESHOLD pixels in any direction, consider it a drag
      isDragging = true;
    }

    if (isDragging) {
      element.style.marginTop = '0';
      draggedElement = element;

      startMouseX = endMouseX - event.clientX;
      startMouseY = endMouseY - event.clientY;

      endMouseX = event.clientX;
      endMouseY = event.clientY;

      element.style.left = element.offsetLeft - startMouseX + 'px';
      element.style.top = element.offsetTop - startMouseY + 'px';
    }
  }

  function stopElementDrag(_: MouseEvent) {
    document.onmouseup = null;
    document.onmousemove = null;

    if (!draggedElement) return;

    if (!isDragging) {
      // If it wasn't a drag, handle it as a click
      onPieceClick(draggedElement);
    } else {
      // If it was a drag, handle it as a drag
      handleDragEvent();
    }

    isDragging = false; // Reset dragging flag
  }

  function handleDragEvent() {
    if (!draggedElement) return;

    const elementXPosition = endMouseX - startMouseX;
    const elementYPosition = endMouseY - startMouseY;

    const droppedOnElements = document.elementsFromPoint(
      elementXPosition,
      elementYPosition,
    ) as Array<HTMLElement>;

    const droppedOnElement = droppedOnElements.filter((element) => {
      return (
        (element.classList.contains('square') ||
          element.classList.contains('item') ||
          element.classList.contains('piece')) &&
        element !== draggedElement
      );
    })[0];

    let parentContainer = undefined;
    if (!droppedOnElement) {
      if (draggedElement.classList.contains('inventory-item')) {
        returnItemToInventory(draggedElement);
        return;
      }
      parentContainer = draggedElement.parentElement ?? undefined;
    } else {
      parentContainer = droppedOnElement.parentElement ?? undefined;
    }

    let isParentContainerABoard = parentContainer?.classList.contains('board');
    while (parentContainer && !isParentContainerABoard) {
      parentContainer = parentContainer.parentElement ?? undefined;

      isParentContainerABoard = parentContainer?.classList.contains('board');
    }

    if (!parentContainer) return;

    if (
      draggedElement.classList.contains('inventory-item') &&
      !canPlaceItemOnBoard(draggedElement, droppedOnElement)
    ) {
      returnItemToInventory(draggedElement);
    } else if (!droppedOnElement) {
      triggerOnFellOffTheBoard(draggedElement, parentContainer.id);
    } else {
      triggerOnAction(draggedElement, droppedOnElement, parentContainer.id);
    }
  }
}

function onPieceMouseClick(event: Event) {
  let element = event.target as HTMLElement;
  // Prevent clicking if the user clicked on an untargetable area
  while (element.classList.contains('untargetable')) {
    element = element.parentElement as HTMLElement;
  }

  if (element.classList.contains('piece')) {
    onPieceClick(element);
  }
}

export function onShopItemClick(event: Event) {
  let element = event.target as HTMLElement;
  // Prevent clicking if the user clicked on an untargetable area
  while (element.classList.contains('untargetable')) {
    element = element.parentElement as HTMLElement;
  }

  if (element.classList.contains('shop-button')) {
    buyItem(element.id);
  }
}

function onPieceClick(pieceElement: HTMLElement) {
  let boardElement = pieceElement.parentElement ?? undefined;

  while (!boardElement?.classList.contains('board')) {
    boardElement = boardElement?.parentElement ?? undefined;
  }

  if (attackingUnicorn) {
    unicornAttackAttempt(attackingUnicorn, pieceElement, boardElement.id);
    selectedPieceElement = undefined;
    attackingUnicorn = undefined;
    hideUnicornAttackButton();
  } else {
    selectedPieceElement = pieceElement;
    onPieceSelected(pieceElement, boardElement.id);
  }
}

function showBoard(boardId: string) {
  const boardElement = document.getElementById(boardId) as HTMLElement;

  OVERWORLD_BOARD.classList.add('collapsed');
  HELL_BOARD.classList.add('collapsed');
  HEAVEN_BOARD.classList.add('collapsed');

  boardElement.classList.remove('collapsed');
}

function handleBoardButtonPress(event: Event) {
  const buttonValue = (event.target as HTMLButtonElement).value;
  showBoard(buttonValue);
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

function swapShopAndUpgrade() {
  if (SHOP_CONTAINER?.classList.contains('collapsed')) {
    SHOP_CONTAINER.classList.remove('collapsed');
    UPGRADES_CONTAINER?.classList.add('collapsed');
    return;
  }
  SHOP_CONTAINER?.classList.add('collapsed');
  UPGRADES_CONTAINER?.classList.remove('collapsed');
}

function onClickOnScreen(event: Event) {
  let element = event.target as HTMLElement;
  // Prevent clicking if the user clicked on an untargetable area
  while (element.classList.contains('untargetable')) {
    element = element.parentElement as HTMLElement;
  }

  if (element.classList.contains('piece')) return;

  removeAllHighlights(OVERWORLD_BOARD_ID);
  removeAllHighlights(HELL_BOARD_ID);
  removeAllHighlights(HEAVEN_BOARD_ID);
}

function onUnicornAttackButtonPressed() {
  if (!selectedPieceElement) return;
  let boardElement = selectedPieceElement.parentElement ?? undefined;
  while (!boardElement?.classList.contains('board')) {
    boardElement = boardElement?.parentElement ?? undefined;
  }
  attackingUnicorn = selectedPieceElement;
}
