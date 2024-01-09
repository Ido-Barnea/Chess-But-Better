import { Logger } from '../../ui/Logger';
import { getCurrentPlayer, isFriendlyFire } from '../Logic';
import { BaseRule } from './BaseRule';

export class FriendlyFireRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 3;
    const description = 'Friendly Fire! Players can attack their own pieces (for a price).';
    const condition = isFriendlyFire;
    const onTrigger = () => {
      const player = getCurrentPlayer();
      Logger.logRule(`${player.color} attacked his own piece and has to pay compensations.`);
      player.gold--;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}