import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
import { BaseRule } from './BaseRule';

export class FirstBloodRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 1;
    const description = 'First Blood Bonus: The first to kill gets an extra XP.';
    const condition = Game.deathCounter == 1;
    const onTrigger = () => {
      const player = Game.getCurrentPlayer();
      Logger.logRule(`${player.color} has made First Blood and received a bonus.`);
      player.xp++;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}