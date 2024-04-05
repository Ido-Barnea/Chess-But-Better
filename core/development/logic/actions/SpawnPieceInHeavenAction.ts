import { HEAVEN_BOARD_ID } from '../../Constants';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { SpawnPieceAction } from './SpawnPieceAction';

export class SpawnPieceInHeavenAction extends SpawnPieceAction {
  constructor(piece: BasePiece) {
    super(piece, HEAVEN_BOARD_ID);
  }
}
