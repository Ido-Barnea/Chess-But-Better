import { INVENTORY_ELEMENT_ID, INVENTORY_WIDTH } from '../Constants';
import { PlayerColors } from '../logic/Players';
import { Item } from '../logic/items/Items';
import { initializeDraggingListeners } from './Events';


const inventoryElement = document.getElementById(INVENTORY_ELEMENT_ID);

function createPlayerInventoryElement(playerColor: PlayerColors): HTMLElement {
  const playerInventoryElement = document.createElement('div');
  playerInventoryElement.id = playerColor;
  playerInventoryElement.classList.add('player-inventory');
  inventoryElement?.appendChild(playerInventoryElement);
  
  return playerInventoryElement;
}

export function showItemOnInventory(
  item: Item,
  playerColor: PlayerColors,
): HTMLElement | undefined {
  const inventoryItemElement = document.createElement('div') as HTMLElement;
  inventoryItemElement.id = item.name;
  inventoryItemElement.classList.add('inventory-item');
  inventoryItemElement.innerHTML = item.resource;
  inventoryItemElement.draggable = true;

  initializeDraggingListeners(inventoryItemElement);

  const playerInventoryElement = document.getElementById(playerColor);

  playerInventoryElement?.childNodes.forEach((child) => {
    if (!child.hasChildNodes()) {
      child.appendChild(inventoryItemElement);
      return;
    }
  });

  if (playerInventoryElement) return playerInventoryElement;
  return undefined;
}

export function initializeInventoryUI(playerColor: PlayerColors) {
  const playerInventoryElement = createPlayerInventoryElement(playerColor);

  for (let index = 0; index < INVENTORY_WIDTH; index++) {
    createInventorySlotElement(playerInventoryElement, playerColor);
  }
  
  if (playerColor === PlayerColors.BLACK) {
    playerInventoryElement?.classList.add('collapsed');
  }
}

function createInventorySlotElement(
  playerInventoryElement: HTMLElement,
  playerColor: PlayerColors,
) {
  const squareElement = document.createElement('div');
  squareElement.classList.add('inventory-square');
  squareElement.setAttribute('player-color', playerColor);

  playerInventoryElement.appendChild(squareElement);
}

export function switchShownInventory(playerColor: PlayerColors): boolean {
  const playerInventoryElement = document.getElementById(playerColor);
  if (!playerInventoryElement) {
    return false;
  }

  const isCollapsed = playerInventoryElement.classList.contains('collapsed');
  if (isCollapsed) {
    playerInventoryElement.classList.remove('collapsed');
  } else {
    playerInventoryElement.classList.add('collapsed');
    removeItemElements(playerInventoryElement);
  }

  return isCollapsed;
}

function removeItemElements(playerInventoryElement: HTMLElement){
  playerInventoryElement.childNodes.forEach((child) => {
    child.firstChild?.remove();
  });
}

export function destroyItemInInventory(itemElement: HTMLElement) {
  itemElement.remove();
}
