import { Player } from '../Players';
import { Position, Square } from './PiecesUtilities';

export class Piece {
  resource: string;
  pieceIcon: string;
  name: string;
  player: Player;
  position: Position;
  moves: number;
  health: number;
  price: number;
  upgrades: Array<new (position: Position, player: Player) => Piece>;
  hasMoved: boolean;
  killCount: number;

  constructor(
    resource: string,
    pieceIcon: string,
    name: string,
    player: Player,
    position: Position,
  ) {
    this.resource = resource;
    this.pieceIcon = pieceIcon;
    this.name = name;
    this.player = player;
    this.position = position;

    this.moves = 1;
    this.health = 1;
    this.price = 1;
    this.upgrades = [];
    this.hasMoved = false;
    this.killCount = 0;
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
