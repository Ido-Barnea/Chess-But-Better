import { Logger } from '../../ui/Logger';
import { Piece } from '../pieces/Piece';
import { Position } from '../pieces/PiecesUtilities';
import { Player } from '../Players';

interface ItemType {
    name: string,
    resource: string,
    price: number,
    position?: Position | undefined,
    use: (piece: Piece) => void;
    drop: (player: Player) => void;
}

export class Item implements ItemType {
  name: string;
  resource: string;
  price: number;
  position: Position | undefined;

  constructor(
    name: string,
    resource: string,
    price: number,
    position?: Position,
  ) {
    this.name = name;
    this.resource = resource;
    this.price = price;
    this.position = position;
  }

  setPosition(position: Position) {
    this.position = position;
  }

  use(piece: Piece) {
    const pieceColor = piece.player.color;
    const pieceName = piece.name;
    const itemName = this.name;
    const pieceCoordinates = piece.position.coordinates;
    Logger.logGeneral(`${pieceColor} ${pieceName} used a ${itemName} on ${pieceCoordinates}.`);
  }

  drop(player: Player) {
    Logger.logGeneral(`${player.color} dropped a ${this.name}.`);
  }
}
