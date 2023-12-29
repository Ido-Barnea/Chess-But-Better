import { Item } from './items';
import { Player } from '../players';
import { Piece, Position } from '../pieces';
import { Logger } from '../../ui/logger';
import { trapResource } from '../../ui/resources';


export class Gold extends Item {
  constructor(player: Player, position: Position) {
    super('gold coin', trapResource, player, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${this.player.color} ${piece.name} 
      found a ${this.name} on ${piece.position.coordinates}.`);

    this.player.gold++;
  }
}