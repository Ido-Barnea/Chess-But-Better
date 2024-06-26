import { ActionResult } from './types/ActionResult';
import { KillPieceAction } from './KillPieceAction';
import { KillLog } from '../../ui/logs/Log';
import { game } from '../../Game';
import { BasePiece } from '../../../model/pieces/abstract/BasePiece';

export class KillPieceByEnvironmentAction extends KillPieceAction {
  private killingSource: string;

  constructor(
    killedPiece: BasePiece,
    killingSource: string,
    originBoardId?: string,
  ) {
    super(killedPiece, originBoardId);
    this.killingSource = killingSource;
  }

  execute(): ActionResult {
    super.execute();

    new KillLog(this.killedPiece, this.killingSource).addToQueue();
    game.endMove();

    return ActionResult.SUCCESS;
  }
}
