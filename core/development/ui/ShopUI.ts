import { SHOP_WIDTH } from '../Constants';
import { BaseItem } from '../logic/items/abstract/Item';
import { onShopItemClick } from './Events';

export function initializeShopUI() {
  const shopElement = document.getElementById('shop-container');
  if (!shopElement) return;

  for (let index = 0; index < SHOP_WIDTH; index++) {
    createShopItemSquare(shopElement);
  }
}

export function createShopItemSquare(shopElement: HTMLElement) {
  const itemSquare = document.createElement('div');
  itemSquare.classList.add('shop-square');

  shopElement.appendChild(itemSquare);
}

export function renderItemOnShopUI(item: BaseItem) {
  const itemElement = document.createElement('div');
  itemElement.id = item.name;
  itemElement.classList.add('shop-item');
  itemElement.innerHTML = item.resource;
  itemElement.addEventListener('click', onShopItemClick);

  const itemPriceElement = document.createElement('p');
  itemPriceElement.classList.add('shop-item-price');
  itemPriceElement.innerHTML = `${item.price}G`;

  const shopElement = document.getElementById('shop-container');
  shopElement?.childNodes.forEach((child) => {
    if (!child.hasChildNodes()) {
      child.appendChild(itemElement);
      child.appendChild(itemPriceElement);
      return;
    }
  });
}
