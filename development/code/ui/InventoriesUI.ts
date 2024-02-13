import { INVENTORY_CLASS_ID, INVENTORY_WIDTH } from '../logic/Constants';
import { PlayerColors } from '../logic/Players';
import { Item } from '../logic/items/Items';


const inventoryElement = document.getElementsByClassName(INVENTORY_CLASS_ID)[0];

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
  const inventoryItemElement = document.createElement('div');
  inventoryItemElement.innerHTML = item.resource;

  const playerInventoryElement = document.getElementById(playerColor);
  
  playerInventoryElement?.childNodes.forEach((child) => {
    if (!child.hasChildNodes()) {
      child.appendChild(inventoryItemElement);
      return;
    }
  });
  if (playerInventoryElement) {
    return playerInventoryElement;
  }
  return undefined;
}

export function initialiseInventoryUI(playerColor: PlayerColors) {
  const playerInventoryElement = createPlayerInventoryElement(playerColor);

  for (let row = 0; row < INVENTORY_WIDTH; row++) {
    for (let column = 0; column < INVENTORY_WIDTH; column++) {
      createInventorySlotElement(playerInventoryElement, playerColor);
    }
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

export function switchShownInventory(playerColor: PlayerColors): boolean | undefined {
  const playerInventoryElement = document.getElementById(playerColor);
  if (!playerInventoryElement) {
    return;
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
