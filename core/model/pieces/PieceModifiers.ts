import { Player } from '../../controller/logic/players/Player';
import { Position } from '../types/Position';
import { BasePiece } from './abstract/BasePiece';

export class PieceModifiers {
  constructor(
    public upgrades: Array<
      new (player: Player, position?: Position) => BasePiece
    > = [],
    public hasMoved = false,
    public killCount = 0,
  ) {}
}
