import { Item } from './Items';
import { Piece } from '../pieces/Pieces';
import { Logger } from '../../ui/Logger';
import { trapResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { spawnItemOnBoard } from '../../LogicAdapter';
import { game } from '../../Game';

export class Trap extends Item {
  constructor(position: Position) {
    super('trap', trapResource, position);
  }

  apply(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} placed a ${this.name} on ${piece.position.coordinates}.`);

    this.position = piece.position;
    game.getItems().push(this);

    spawnItemOnBoard(this);
  }
}