import { Player } from '../Players';
import { PieceType, Position, Square } from './PiecesUtilities';

export class Piece implements PieceType {
  position: Position;
  player: Player;
  name: string;
  hasMoved: boolean;
  killCount: number;

  resource: string;
  pieceIcon: string;

  constructor(
    position: Position,
    player: Player,
    name: string,
    resource: string,
    pieceIcon: string,
  ) {
    this.position = position;
    this.player = player;
    this.name = name;
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
