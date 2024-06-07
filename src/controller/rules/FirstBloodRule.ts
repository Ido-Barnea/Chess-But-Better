// import { RuleLog } from '../../ui/logs/Log';
import { IDeathsCounter } from '../game state/counters/deaths counter/abstract/IDeathsCounter';
import { IKillerPieceSwitcher } from '../game state/switchers/killer piece switcher/abstract/IKillerPieceSwitcher';
import { ITurnSwitcher } from '../game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { BaseRule } from './abstract/BaseRule';

export class FirstBloodRule extends BaseRule {
  constructor(
    turnSwitcher: ITurnSwitcher,
    deathsCounter: IDeathsCounter,
    killerPieceSwitcher: IKillerPieceSwitcher,
    isRevealed = false
  ) {
    const description =
      'First Blood Bonus: The first to kill gets an extra XP.';
    const condition = () => deathsCounter.getCount() == 1 && !!killerPieceSwitcher.getKillerPiece();
    const onTrigger = () => {
      const player = turnSwitcher.getCurrentPlayer();
      // new RuleLog(
      //   `${player.color} has made First Blood and received a bonus.`,
      // ).addToQueue();
      player.xp++;
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
