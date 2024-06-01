import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { IValidator } from './abstract/IValidator';
import { IMovesCounter } from '../moves counter/abstract/IMovesCounter';

export class PlayerMovesValidator implements IValidator {
  private draggedPiece: BasePiece;
  private movesCounter: IMovesCounter;

  constructor(
    draggedPiece: BasePiece,
    movesCounter: IMovesCounter,
  ) {
    this.draggedPiece = draggedPiece;
    this.movesCounter = movesCounter;
  }

  validate(): boolean {
    if (this.movesCounter.getRemainingMovesCount() === 0) {
      this.movesCounter.setRemainingMovesCount(this.draggedPiece.stats.moves);
    }
    
    return this.movesCounter.getRemainingMovesCount() > 0;
  }
}
