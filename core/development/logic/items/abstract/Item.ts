import { Position } from '../../../../model/types/Position';
import { ItemActionResult } from '../types/ItemActionResult';

export abstract class BaseItem {
  name: string;
  resource: string;
  price: number;
  position: Position | undefined;

  constructor(
    name: string,
    resource: string,
    price: number,
    position?: Position,
  ) {
    this.name = name;
    this.resource = resource;
    this.price = price;
    this.position = position;
  }

  abstract use(position: Position): ItemActionResult;
}
