import { BasePiece } from '../abstract/BasePiece';
import { Position } from './Position';

export type Square = {
  position: Position;
  occupent?: BasePiece;
};
