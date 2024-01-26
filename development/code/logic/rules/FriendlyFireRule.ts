import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { BaseRule } from './BaseRule';

export class FriendlyFireRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Friendly Fire! Players can attack their own pieces (for a price).';
    const condition = () => game.getIsFriendlyFire();
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      Logger.logRule(`${player.color} attacked his own piece and has to pay compensations.`);
      player.gold--;
    };

    super(description, isRevealed, condition, onTrigger);
  }
}