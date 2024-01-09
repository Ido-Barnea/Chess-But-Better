import { Logger } from '../../ui/Logger';
import { deathCounter, getCurrentPlayer } from '../GameController';
import { BaseRule } from './BaseRule';

export class FirstBloodRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 1;
    const description = 'First Blood Bonus: The first to kill gets an extra XP.';
    const condition = deathCounter == 1;
    const onTrigger = () => {
      const player = getCurrentPlayer();
      Logger.logRule(`${player.color} has made First Blood and received a bonus.`);
      player.xp++;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}