import { Item } from './items';
import { Piece, Position } from '../pieces';
import { Logger } from '../../ui/logger';
import { coinResource } from '../../ui/resources';


export class Coin extends Item {
  constructor(position: Position) {
    super('gold coin', coinResource, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} 
      dropped a ${this.name} on ${piece.position.coordinates}.`);

    piece.player.gold--;
  }
}