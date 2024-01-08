import { Item } from './Items';
import { Piece, Position } from '../pieces/Pieces';
import { items } from '../Logic';
import { Logger } from '../../ui/Logger';
import { spawnItemOnBoard } from '../../ui/Boards';
import { trapResource } from '../../ui/Resources';


export class Trap extends Item {
  constructor(position: Position) {
    super('trap', trapResource, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} 
      placed a ${this.name} on ${piece.position.coordinates}.`);

    this.position = piece.position;
    items.push(this);

    spawnItemOnBoard(this);
  }
}