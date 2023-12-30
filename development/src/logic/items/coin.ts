import { Item } from './items';
import { Piece, Position } from '../pieces';
import { coinResource } from '../../ui/resources';


export class Coin extends Item {
  constructor(position: Position) {
    super('gold coin', coinResource, position);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply(_: Piece) {}
}