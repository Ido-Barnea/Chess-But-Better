import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
import { BaseRule } from './BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 0;
    const description = 'Pieces can fall off the board.';
    const condition = Game.fellOffTheBoardPiece !== undefined;
    const onTrigger = () => {
      Logger.logRule(`
        A ${Game.fellOffTheBoardPiece?.player.color} ${Game.fellOffTheBoardPiece?.name} fell off the board.
      `);
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}