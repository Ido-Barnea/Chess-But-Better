import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './abstract/BaseRule';

export class FriendlyFireRule extends BaseRule {
  constructor(isRevealed = false) {
    const description =
      'Friendly Fire! Players can attack their own pieces (for a price).';
    const condition = () => game.getIsFriendlyFire();
    const onTrigger = () => {
      const player = game.getPlayersTurnSwitcher().getCurrentPlayer();
      new RuleLog(
        `${player.color} attacked his own piece and has to pay compensations.`,
      ).addToQueue();
      player.gold--;
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
