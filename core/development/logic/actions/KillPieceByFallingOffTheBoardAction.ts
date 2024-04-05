import { BasePiece } from '../pieces/abstract/BasePiece';
import { KillPieceByEnvironment } from './KillPieceByEnvironmentAction';

export class KillPieceByFallingOffTheBoardAction extends KillPieceByEnvironment {
  constructor(killedPiece: BasePiece) {
    super(killedPiece, 'the void');
  }
}
