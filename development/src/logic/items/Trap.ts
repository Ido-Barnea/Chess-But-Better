import { Item } from './Items';
import { Piece } from '../pieces/Pieces';
import { Logger } from '../../ui/Logger';
import { trapResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesHelpers';
import { spawnItemOnBoard } from '../../LogicAdapter';
import { Game } from '../GameController';


export class Trap extends Item {
  constructor(position: Position) {
    super('trap', trapResource, position);
  }

  apply(game: Game, piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} placed a ${this.name} on ${piece.position.coordinates}.`);

    this.position = piece.position;
    game.items.push(this);

    spawnItemOnBoard(this);
  }
}