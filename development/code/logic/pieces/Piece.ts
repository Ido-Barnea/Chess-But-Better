import { Player } from '../Players';
import { PieceType, Position, Square } from './PiecesUtilities';

export class Piece implements PieceType {
  resource: string;
  pieceIcon: string;
  name: string;
  player: Player;
  position: Position;
  upgrades: Array<Piece>;
  price: number;
  hasMoved: boolean;
  killCount: number;

  constructor(
    resource: string,
    pieceIcon: string,
    name: string,
    player: Player,
    position: Position,
    upgrades: Array<Piece> = [],
    price = 1,
  ) {
    this.name = name;
    this.player = player;
    this.position = position;
    this.upgrades = upgrades;
    this.price = price;
    this.hasMoved = false;
    this.killCount = 0;
    
    this.resource = resource;
    this.pieceIcon = pieceIcon;
  }

  getLegalMoves(): Array<Position> {
    return [];
  }

  isValidSpawn(_: Piece | Square) {
    return false;
  }

  copyPosition(): Position {
    return {
      coordinates: Array.from(this.position.coordinates) as [number, number],
      boardId: this.position.boardId,
    };
  }
}
