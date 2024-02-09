import { Piece } from './Piece';
import { Player } from '../Players';
import { Item } from '../items/Items';
import { comparePositions } from '../Utilities';
import { game } from '../../Game';

export type Position = {
  coordinates: [number, number],
  boardId: string,
}

export type Square = {
  position: Position;
  occupent?: Piece;
};

export interface PieceType {
  resource: string;
  pieceIcon: string;
  name: string;
  player: Player;
  position: Position;
  upgrades: Array<Piece>;
  hasMoved: boolean;
  killCount: number;
}

export function getItemByPosition(
  position: Position,
): Item | undefined {
  return game.getItems().find((item) => comparePositions(position, item.position));
}

