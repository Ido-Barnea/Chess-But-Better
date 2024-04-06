import { BasePiece } from '../pieces/abstract/BasePiece';
import { ActionResult } from './types/ActionResult';
import { KillLog } from '../../ui/logs/Log';
import { game } from '../../Game';
import { MIN_KILLINGS_FOR_BOUNTY } from '../../Constants';
import { destroyItemOnPiece, movePieceOnBoard } from '../../LogicAdapter';
import { Position } from '../pieces/types/Position';
import { KillPieceAction } from './KillPieceAction';
export class KillPieceByPieceAction extends KillPieceAction {
  private killerPiece: BasePiece;

  constructor(killedPiece: BasePiece, killerPiece: BasePiece) {
    super(killedPiece, killedPiece.position?.boardId);
    this.killerPiece = killerPiece;
  }

  execute(): ActionResult {
    this.killedPiece.health--;
    if (this.killedPiece.health > 0) {
      this.failToKillPiece();
      return ActionResult.FAILURE;
    }

    this.killerPiece.killCount++;
    if (this.killedPiece.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
      this.killerPiece.player.gold += this.killedPiece.killCount;
    }

    game.setKillerPiece(this.killerPiece);
    new KillLog(this.killedPiece, this.killerPiece).addToQueue();

    return super.execute();
  }

  failToKillPiece() {
    if (!this.killedPiece.position || !this.killerPiece.position) return;
    destroyItemOnPiece(this.killedPiece);

    let directionX = 0;
    let directionY = 0;
    const targetXPosition = this.killedPiece.position.coordinates[0];
    const targetYPosition = this.killedPiece.position.coordinates[1];
    const deltaX = this.killerPiece.position.coordinates[0] - targetXPosition;
    const deltaY = this.killerPiece.position.coordinates[1] - targetYPosition;
    if (deltaX !== 0) {
      directionX = deltaX / Math.abs(deltaX);
    }
    if (deltaY !== 0) {
      directionY = deltaY / Math.abs(deltaY);
    }

    const newPosition: Position = {
      coordinates: [targetXPosition + directionX, targetYPosition + directionY],
      boardId: this.killerPiece.position.boardId,
    };

    movePieceOnBoard(this.killerPiece, newPosition);
    this.killerPiece.position = newPosition;

    game.endMove();
  }
}
