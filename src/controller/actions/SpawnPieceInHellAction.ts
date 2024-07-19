import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { HELL_BOARD_ID } from '../Constants';
import { SpawnPieceAction } from './SpawnPieceAction';

export class SpawnPieceInHellAction extends SpawnPieceAction {
  constructor(piece: BasePiece) {
    super(piece, HELL_BOARD_ID);
  }
}
