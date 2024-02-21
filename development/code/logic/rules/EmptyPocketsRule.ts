import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './BaseRule';

export class EmptyPocketsRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Empty pockets.';
    const condition = () => {
      let result = false;
      game.getPlayers().forEach((player) => {
        if (player === game.getCurrentPlayer() && player.gold < 0) {
          result = true;
        }
      });
      return result;
    };
    const onTrigger = () => {
      game.getPlayers().forEach((player) => {
        if (player === game.getCurrentPlayer() && player.gold < 0) {
          new RuleLog(
            `${player.color} is in debt. They lose XP for not being prudent.`,
          ).addToQueue();
          player.xp--;
          return;
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
