import { BasePiece } from '../pieces/abstract/BasePiece';
import { ActionResult } from './types/ActionResult';
import { KillPieceAction } from './KillPieceAction';
import { KillLog } from '../../ui/logs/Log';

export class KillPieceByEnvironment extends KillPieceAction {
  private killingSource: string;

  constructor(killedPiece: BasePiece, killingSource: string) {
    super(killedPiece);
    this.killingSource = killingSource;
  }

  execute(): ActionResult {
    super.execute();

    new KillLog(this.killedPiece, this.killingSource).addToQueue();
    
    return ActionResult.SUCCESS;
  }
}
