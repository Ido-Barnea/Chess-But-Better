import { IFriendlyFireSwitcher } from '../game-state/switchers/friendly-fire-switcher/abstract/IFriendlyFireSwitcher';
import { ITurnSwitcher } from '../game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
// import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './abstract/BaseRule';

export class FriendlyFireRule extends BaseRule {
  constructor(turnSwitcher: ITurnSwitcher, friendlyFireSwitcher: IFriendlyFireSwitcher, isRevealed = false) {
    const description = 'Friendly Fire! Players can attack their own pieces (for a price).';
    const condition = () => friendlyFireSwitcher.getFriendlyFireState();
    const onTrigger = () => {
      const player = turnSwitcher.getCurrentPlayer();
      // new RuleLog(
      //   `${player.color} attacked his own piece and has to pay compensations.`,
      // ).addToQueue();
      player.gold--;
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
