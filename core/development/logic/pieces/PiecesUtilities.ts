import { Piece } from './Piece';
import { BaseItem } from '../items/abstract/Item';
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

export function getItemByPosition(position: Position): BaseItem | undefined {
  return game
    .getItems()
    .find((item) => comparePositions(position, item.position));
}
