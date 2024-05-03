import { BaseItem } from '../logic/items/abstract/Item';
import { onShopItemClick } from './Events';

function createShopItemBuyButtonElement(item: BaseItem): HTMLElement {
  const buyItemButtonElement = document.createElement('button');
  buyItemButtonElement.textContent = `${item.price}G`;
  buyItemButtonElement.classList.add('shop-button');

  buyItemButtonElement.addEventListener('click', onShopItemClick);

  return buyItemButtonElement;
}

function createItemElement(item: BaseItem): HTMLElement {
  const itemElement = document.createElement('div');
  itemElement.id = item.name;
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

export function renderShopItemsElements(items: Array<BaseItem>) {
  const shopContainerElement = document.getElementById('shop-container');
  if (!shopContainerElement) return;

  items.forEach(item => {
    createShopItemSquare(shopContainerElement, item);
  });
}
