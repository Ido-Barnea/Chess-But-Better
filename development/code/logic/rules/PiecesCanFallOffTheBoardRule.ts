import { game } from '../../Game';
import { BaseRule } from './BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Pieces can fall off the board.';
    const condition = () => !!game.getFellOffTheBoardPiece();
    const onTrigger = () => { return; };

    super(description, isRevealed, condition, onTrigger);
  }
}
