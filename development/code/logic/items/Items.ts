import { Logger } from '../../ui/Logger';
import { Piece } from '../pieces/Pieces';
import { Position } from '../pieces/PiecesUtilities';
import { Player } from '../Players';

interface ItemType {
    name: string,
    resource: string,
    position: Position,
    use: (piece: Piece) => void;
    drop: (player: Player) => void;
}

export class Item implements ItemType {
  name: string;
  resource: string;
  position: Position;

  constructor(
    name: string,
    resource: string,
    position: Position,
  ) {
    this.name = name;
    this.resource = resource;
    this.position = position;
  }

  use(piece: Piece) {
    Logger.logGeneral(`${piece.player.color} ${piece.name} used a ${this.name} on ${piece.position.coordinates}.`);
  }

  drop(player: Player) {
    Logger.logGeneral(`${player.color} dropped a ${this.name}.`);
  }
}
