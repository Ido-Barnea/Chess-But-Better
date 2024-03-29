import { Player } from '../../players/Player';
import { Position } from '../PiecesUtilities';
import { Piece } from './Piece';

export abstract class BasePiece implements Piece {
  resource: string;
  pieceIcon: string;
  name: string;
  player: Player;
  position: Position | undefined;
  moves: number;
  health: number;
  price: number;
  isEquipedItem: boolean;
  upgrades: Array<new (player: Player, position?: Position) => BasePiece>;
  hasMoved: boolean;
  killCount: number;

  constructor(
    resource: string,
    pieceIcon: string,
    name: string,
    player: Player,
    position?: Position,
  ) {
    this.resource = resource;
    this.pieceIcon = pieceIcon;
    this.name = name;
    this.player = player;
    this.position = position;

    this.moves = 1;
    this.health = 1;
    this.price = 1;
    this.isEquipedItem = false;
    this.upgrades = [];
    this.hasMoved = false;
    this.killCount = 0;
  }
  
  abstract getLegalMoves(): Position[];

  copyPosition(): Position | undefined {
    if (!this.position) return;
    return {
      coordinates: Array.from(this.position.coordinates) as [number, number],
      boardId: this.position.boardId,
    };
  }
}
