import { Player } from '../Players';
import { PieceType, Position, Square } from './PiecesUtilities';

export class Piece implements PieceType {
  position: Position;
  player: Player;
  resource: string;
  name: string;
  hasMoved: boolean;
  hasKilled: boolean;
  pieceLogo: string;

  constructor(
    position: Position,
    player: Player,
    resource: string,
    name: string,
    pieceLogo: string,
  ) {
    this.position = position;
    this.player = player;
    this.resource = resource;
    this.name = name;
    this.hasMoved = false;
    this.hasKilled = false;
    this.pieceLogo = pieceLogo;
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
