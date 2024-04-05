import { BasePiece } from '../pieces/abstract/BasePiece';
import { ActionResult } from './types/ActionResult';
import { KillPieceAction } from './KillPieceAction';
import { KillLog } from '../../ui/logs/Log';
import { game } from '../../Game';
import { VOID_BOARD_ID } from '../../Constants';

export class KillPieceByEnvironment extends KillPieceAction {
  private killingSource: string;

  constructor(killedPiece: BasePiece, killingSource: string) {
    super(killedPiece);
    this.killingSource = killingSource;
  }

  execute(): ActionResult {
    if (!this.killedPiece.position) return ActionResult.FAILURE;
    this.killedPiece.position.boardId = VOID_BOARD_ID;
    
    super.execute();

    new KillLog(this.killedPiece, this.killingSource).addToQueue();
    game.endMove();
    
    return ActionResult.SUCCESS;
  }
}
