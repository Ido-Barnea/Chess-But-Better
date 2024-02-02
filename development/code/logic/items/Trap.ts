import { Item } from './Items';
import { Piece } from '../pieces/Pieces';
import { Logger } from '../../ui/Logger';
import { trapResource } from '../../ui/Resources';
import { spawnItemOnBoard } from '../../LogicAdapter';
import { game } from '../../Game';
import { Position } from '../pieces/PiecesUtilities';

export class Trap extends Item {
  constructor(position?: Position) {
    super('trap', trapResource, 3, position);
  }

  use(piece: Piece): void {
    Logger.logGeneral(`${piece.player.color} ${piece.name} placed a ${this.name} on ${piece.position.coordinates}.`);

    this.position = piece.position;
    game.getItems().push(this);

    spawnItemOnBoard(this);
  }
}