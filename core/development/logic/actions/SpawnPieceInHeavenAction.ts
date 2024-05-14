import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { HEAVEN_BOARD_ID } from '../../Constants';
import { SpawnPieceAction } from './SpawnPieceAction';

export class SpawnPieceInHeavenAction extends SpawnPieceAction {
  constructor(piece: BasePiece) {
    super(piece, HEAVEN_BOARD_ID);
  }
}
