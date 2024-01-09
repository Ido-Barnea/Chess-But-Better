import { Logger } from '../../ui/Logger';
import { fellOffTheBoardPiece } from '../Logic';
import { BaseRule } from './BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 0;
    const description = 'Pieces can fall off the board.';
    const condition = !!fellOffTheBoardPiece;
    const onTrigger = () => {
      Logger.logRule(`A ${fellOffTheBoardPiece?.player.color} ${fellOffTheBoardPiece?.name} fell off the board.`);
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}