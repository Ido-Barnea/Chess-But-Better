import { Player } from '../Players';
import { Item } from '../items/Items';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { PieceType, Position, Square } from './PiecesHelpers';
import { Game } from '../GameController';

export class Piece implements PieceType {
  game: Game;
  position: Position;
  player: Player;
  resource: string;
  name: string;
  hasMoved: boolean;
  hasKilled: boolean;
  pieceLogo: string;

  constructor(
    game: Game,
    position: Position,
    player: Player,
    resource: string,
    name: string,
    pieceLogo: string,
  ) {
    this.game = game;
    this.position = position;
    this.player = player;
    this.resource = resource;
    this.name = name;
    this.hasMoved = false;
    this.hasKilled = false;
    this.pieceLogo = pieceLogo;
  }

  validateMove(_: Piece | Square | Item): Position {
    return {
      coordinates: [-1, -1],
      boardId: OVERWORLD_BOARD_ID,
    };
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
