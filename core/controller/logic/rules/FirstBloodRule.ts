import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './abstract/BaseRule';

export class FirstBloodRule extends BaseRule {
  constructor(isRevealed = false) {
    const description =
      'First Blood Bonus: The first to kill gets an extra XP.';
    const condition = () =>
      game.getDeathCounter() == 1 && !!game.getKillerPiece();
    const onTrigger = () => {
      const player = game.getPlayersTurnSwitcher().getCurrentPlayer();
      new RuleLog(
        `${player.color} has made First Blood and received a bonus.`,
      ).addToQueue();
      player.xp++;
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
