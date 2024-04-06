import { VOID_BOARD_ID } from '../../Constants';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { KillPieceByEnvironment } from './KillPieceByEnvironmentAction';
import { ActionResult } from './types/ActionResult';
export class KillPieceByFallingOffTheBoardAction extends KillPieceByEnvironment {
  constructor(killedPiece: BasePiece) {
    super(killedPiece, 'the void', killedPiece.position?.boardId);
  }

  execute(): ActionResult {
    if (!this.killedPiece.position) return ActionResult.FAILURE;

    this.killedPiece.position.boardId = VOID_BOARD_ID;

    return super.execute();
  }
}
