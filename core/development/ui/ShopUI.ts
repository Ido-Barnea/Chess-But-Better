import { BaseItem } from '../logic/items/abstract/Item';
import { onShopItemClick } from './Events';

function createShopItemBuyButtonElement(item: BaseItem): HTMLElement {
  const buyItemButtonElement = document.createElement('button');
  buyItemButtonElement.id = item.name;
  buyItemButtonElement.textContent = `${item.price}G`;
  buyItemButtonElement.classList.add('shop-button');

  buyItemButtonElement.addEventListener('click', onShopItemClick);
  buyItemButtonElement.classList.add('disabled');

  return buyItemButtonElement;
}

function createItemElement(item: BaseItem): HTMLElement {
  const itemElement = document.createElement('div');
  itemElement.classList.add('shop-item');
  itemElement.innerHTML = item.resource;

  return itemElement;
}

function createShopItemSquare(shopElement: HTMLElement, item: BaseItem) {
  const itemSquareElement = document.createElement('div');
  itemSquareElement.classList.add('shop-square');

  const buyItemButtonElement = createShopItemBuyButtonElement(item);
  itemSquareElement.appendChild(buyItemButtonElement);

  const itemElement = createItemElement(item);
  itemSquareElement.appendChild(itemElement);

  shopElement.appendChild(itemSquareElement);
}

export function renderInitialShopItemsElements(
  items: Array<BaseItem>,
  playerGold: number,
) {
  const shopContainerElement = document.getElementById('shop-container');
  if (!shopContainerElement) return;

  items.forEach((item) => {
    createShopItemSquare(shopContainerElement, item);
  });
  updateShopButtonsState(items, playerGold);
}

export function updateShopButtonsState(
  items: Array<BaseItem>,
  playerGold: number,
) {
  const shopButtons = document.querySelectorAll('.shop-button');

  shopButtons.forEach((button, index) => {
    const item = items[index];
    if (item.price > playerGold) {
      button.classList.add('disabled');
    } else {
      button.classList.remove('disabled');
    }
  });
}
