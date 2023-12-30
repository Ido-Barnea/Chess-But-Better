import { Item } from './items';
import { Piece, Position } from '../pieces';
import { items } from '../logic';
import { Logger } from '../../ui/logger';
import { spawnItemOnBoard } from '../../ui/boards';
import { trapResource } from '../../ui/resources';


export class Trap extends Item {
  constructor(position: Position) {
    super('trap', trapResource, position);
  }

  apply(piece: Piece) {
    Logger.logItemMessage(`${piece.player.color} ${piece.name} 
      placed a ${this.name} on ${piece.position.coordinates}.`, this.name);

    this.position = piece.position;
    items.push(this);

    spawnItemOnBoard(this);
  }
}