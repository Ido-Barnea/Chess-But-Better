import { HELL_BOARD_ID } from '../../Constants';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { SpawnPieceAction } from './SpawnPieceAction';

export class SpawnPieceInHellAction extends SpawnPieceAction {
  constructor(piece: BasePiece) {
    super(piece, HELL_BOARD_ID);
  }
}
