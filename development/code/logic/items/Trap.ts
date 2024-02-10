import { Item } from './Items';
import { Piece } from '../pieces/Piece';
import { trapResource } from '../../ui/Resources';
import { spawnItemOnBoard } from '../../LogicAdapter';
import { game } from '../../Game';
import { Position } from '../pieces/PiecesUtilities';
import { Log } from '../../ui/logs/Log';

export class Trap extends Item {
  constructor(position?: Position) {
    super('trap', trapResource, 3, position);
  }

  use(piece: Piece): void {
    const {
      position: { coordinates: pieceCoordinates },
      player: { color: playerColor },
      name: pieceName,
    } = piece;
    new Log(`${playerColor} ${pieceName} placed a ${this.name} on ${pieceCoordinates}.`).addToQueue();

    this.position = piece.position;
    game.getItems().push(this);

    spawnItemOnBoard(this);
  }
}