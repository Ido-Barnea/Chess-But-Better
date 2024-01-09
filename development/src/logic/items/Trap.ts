import { Item } from './Items';
import { Piece } from '../pieces/Pieces';
import { Logger } from '../../ui/Logger';
import { spawnItemOnBoard } from '../../ui/BoardManager';
import { trapResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesHelpers';
import { items } from '../GameController';


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