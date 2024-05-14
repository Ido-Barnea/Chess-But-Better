import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { VOID_BOARD_ID } from '../../Constants';
import { KillPieceByEnvironmentAction } from './KillPieceByEnvironmentAction';
import { ActionResult } from './types/ActionResult';
export class KillPieceByFallingOffTheBoardAction extends KillPieceByEnvironmentAction {
  constructor(killedPiece: BasePiece) {
    super(killedPiece, 'the void', killedPiece.position?.boardId);
  }

  execute(): ActionResult {
    if (!this.killedPiece.position) return ActionResult.FAILURE;

    this.killedPiece.position.boardId = VOID_BOARD_ID;

    return super.execute();
  }
}
