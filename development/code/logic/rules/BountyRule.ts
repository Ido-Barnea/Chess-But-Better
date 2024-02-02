import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { BaseRule } from './BaseRule';

export class BountyRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Bounty.';
    const condition = () => {
      let result = false;
      game.getPieces().forEach(piece => {
        if (piece.killCount >= 3) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      if (this.isRevealed) return;

      game.getPieces().forEach(piece => {
        if (piece.killCount >= 3) {
          Logger.logRule(`There is an open bounty on a ${piece.player.color} ${piece.name}.`);
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
