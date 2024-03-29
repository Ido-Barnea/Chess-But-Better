import { BaseItem } from '../items/abstract/Item';
import { comparePositions } from '../Utilities';
import { game } from '../../Game';
import { BasePiece } from './abstract/BasePiece';

export type Position = {
  coordinates: [number, number];
  boardId: string;
};

export type Square = {
  position: Position;
  occupent?: BasePiece;
};

export function getItemByPosition(position: Position): BaseItem | undefined {
  return game
    .getItems()
    .find((item) => comparePositions(position, item.position));
}
