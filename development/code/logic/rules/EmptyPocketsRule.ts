import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
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
          Logger.logRule(`${player.color} is in debt. They lose XP for not handling money properly.`);
          player.xp--;
          return;
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
