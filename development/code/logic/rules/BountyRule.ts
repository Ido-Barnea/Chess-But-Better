import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { MIN_KILLINGS_FOR_BOUNTY } from '../Constants';
import { BaseRule } from './BaseRule';

export class BountyRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Bounty.';
    const condition = () => {
      let result = false;
      game.getPieces().forEach(piece => {
        if (piece.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      game.getPieces().forEach(piece => {
        if (piece.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
          Logger.logRule(`There is an open bounty on a ${piece.player.color} ${piece.name} [${piece.position.coordinates.join(',')}].`);
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
