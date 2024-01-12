import { Item } from './Items';
import { Piece } from '../pieces/Pieces';
import { Logger } from '../../ui/Logger';
import { coinResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';

export class Coin extends Item {
  constructor(position: Position) {
    super('gold coin', coinResource, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} dropped a ${this.name} on ${piece.position.coordinates}.`);
    piece.player.gold--;
  }
}