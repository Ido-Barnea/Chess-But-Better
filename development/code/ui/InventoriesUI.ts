import { INVENTORY_CLASS_ID, INVENTORY_WIDTH } from '../logic/Constants';
import { Item } from '../logic/items/Items';


const inventoryElement = document.getElementsByClassName(INVENTORY_CLASS_ID)[0];

function createPlayerInventoryElement(playerColor: string): HTMLElement {
  const _playerInventoryElement = document.createElement('div');
  _playerInventoryElement.id = playerColor;
  _playerInventoryElement.classList.add('player-inventory');
  (inventoryElement)?.appendChild(_playerInventoryElement);
  
  return _playerInventoryElement;
}

export function showItemOnInventory(item: Item, playerColor: string): HTMLElement | undefined{
  const inventoryItemElement = document.createElement('li');
  inventoryItemElement.innerHTML = item.name;

  const playerInventoryElement = document.getElementById(playerColor);
  
  playerInventoryElement?.childNodes.forEach((child) => {
    console.log(child.hasChildNodes());
    if (!child.hasChildNodes()) {
      child.appendChild(inventoryItemElement);
      return;
    }
  });
  if (playerInventoryElement) {
    return playerInventoryElement;
  }
  else undefined;
}

export function initialiseInventory(playerColor: string)  {
  const playerInventoryElement = createPlayerInventoryElement(playerColor);

  for (let row = 0; row < INVENTORY_WIDTH; row++) {
    for (let column = 0; column < INVENTORY_WIDTH; column++){
      createSquare(playerInventoryElement, playerColor);
    }
  }
  
  if (playerColor === 'Black') {
    playerInventoryElement?.classList.add('collapsed');
  }
}

function createSquare(playerInventoryElement: HTMLElement, playerColor: string) {
  const squareElement = document.createElement('div');
  squareElement.classList.add('inventory-square');
  squareElement.setAttribute('player-color', playerColor);

  playerInventoryElement.appendChild(squareElement);
}

export function changeInventoryVisibility(playerColor: string): boolean | undefined {
  const playerInventoryElement = document.getElementById(playerColor);
  if (!playerInventoryElement) {
    return;
  }

  const isCollapsed = playerInventoryElement.classList.contains('collapsed');
  if (isCollapsed) {
    playerInventoryElement.classList.remove('collapsed');
  } 
  else {
    playerInventoryElement.classList.add('collapsed');
    removeItemElements(playerInventoryElement);
    console.log(playerColor);
  }

  return isCollapsed;
}

function removeItemElements(playerInventoryElement: HTMLElement){
  playerInventoryElement.childNodes.forEach((child) => {
    child.firstChild?.remove();
  });
}
