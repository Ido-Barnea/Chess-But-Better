import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { BaseRule } from './BaseRule';

export class FirstBloodRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'First Blood Bonus: The first to kill gets an extra XP.';
    const condition = () => game.getDeathCounter() == 1 && game.getIsPieceKilled();
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      Logger.logRule(`${player.color} has made First Blood and received a bonus.`);
      player.xp++;
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
