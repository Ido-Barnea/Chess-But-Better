import { BaseItem } from '../../items/abstract/Item';
import { Player } from '../../players/Player';
import { ShopActionResult } from '../types/ShopActionResult';

export interface Shop {
  buyItem(item: BaseItem, buyer: Player): ShopActionResult;
  getItems(): Array<BaseItem>;
}
