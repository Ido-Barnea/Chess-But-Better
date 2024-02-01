import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { BaseRule } from './BaseRule';

export class WithAgeComesWisdomRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'With age comes wisdom.';
    const condition = () => game.getRoundCounter() === 20;
    const onTrigger = () => {
      Logger.logRule('Children of war, you have grown old. Each player gains five XP.');
      game.getPlayers().forEach((player) => {
        Logger.logGeneral(`${player.color} gained XP.`);
        player.xp += 5;
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
