//import { RuleLog } from '../../../ui/logs/Log';
import { ITurnSwitcher } from '../../game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { IRule } from './IRule';

export class BaseRule implements IRule {
  description: string;
  isRevealed: boolean;
  condition: () => boolean;
  onTrigger: () => void;

  private turnSwitcher: ITurnSwitcher;

  constructor(
    description: string,
    isRevealed: boolean,
    condition: () => boolean,
    onTrigger: () => void,
    turnSwitcher: ITurnSwitcher,
  ) {
    this.description = description;
    this.isRevealed = isRevealed;
    this.condition = condition;
    this.onTrigger = onTrigger;
    this.turnSwitcher = turnSwitcher;
  }

  trigger() {
    if (this.condition()) {
      this.onTrigger();
      if (!this.isRevealed) {
        const player = this.turnSwitcher.getCurrentPlayer();

        // new RuleLog(
        //   `${player.color} received XP for revealing a new rule: ${this.description}`,
        // ).addToQueue();

        player.xp++;
        this.isRevealed = true;
      }
    }
  }
}
