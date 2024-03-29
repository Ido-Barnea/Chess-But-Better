import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './abstract/BaseRule';

export class EmptyPocketsRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Empty pockets.';
    const condition = () => {
      let result = false;
      game.getPlayers().forEach((player) => {
        if (
          player === game.getPlayersTurnSwitcher().getCurrentPlayer() &&
          player.gold < 0
        ) {
          result = true;
        }
      });
      return result;
    };
    const onTrigger = () => {
      game.getPlayers().forEach((player) => {
        if (
          player === game.getPlayersTurnSwitcher().getCurrentPlayer() &&
          player.gold < 0
        ) {
          new RuleLog(
            `${player.color} is in debt. They lose XP for not being prudent.`,
          ).addToQueue();
          new RuleLog(
            `${player.color} is in debt. Soon, some of their pieces might desert!`,
          ).addToQueue();
          player.xp--;
          return;
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
