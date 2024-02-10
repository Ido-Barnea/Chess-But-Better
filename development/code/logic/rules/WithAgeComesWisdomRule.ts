import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './BaseRule';

export class WithAgeComesWisdomRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'With age comes wisdom.';
    const condition = () => game.getRoundCounter() === 20;
    const onTrigger = () => {
      new RuleLog('Children of war, you have grown old. Each player gains five XP.').addToQueue();
      game.getPlayers().forEach((player) => {
        player.xp += 5;
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
