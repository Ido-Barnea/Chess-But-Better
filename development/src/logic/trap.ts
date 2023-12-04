import { Item } from './items';
import { Player } from './players';
import { Piece, Position } from './pieces';
import { items } from './logic';
import { Logger } from '../ui/logger';
import { spawnItemOnBoard } from '../ui/boards';
import { trapResource } from '../ui/resources';


export class Trap extends Item {
  constructor(player: Player, position: Position) {
    super('trap', trapResource, player, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${this.player.color} ${piece.name} 
      placed a ${this.name} on ${piece.position.coordinates}.`);

    this.position = piece.position;
    items.push(this);

    spawnItemOnBoard(this);
  }
}