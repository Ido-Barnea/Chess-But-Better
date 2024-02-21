import { Piece } from './Piece';
import { Item } from '../items/Items';
import { comparePositions } from '../Utilities';
import { game } from '../../Game';

export type Position = {
  coordinates: [number, number];
  boardId: string;
};

export type Square = {
  position: Position;
  occupent?: Piece;
};

export function getItemByPosition(position: Position): Item | undefined {
  return game
    .getItems()
    .find((item) => comparePositions(position, item.position));
}
