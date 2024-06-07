import { IPlayersStorage } from '../game state/storages/players storage/abstract/IPlayersStorage';
import { ITurnSwitcher } from '../game state/switchers/turn switcher/abstract/ITurnSwitcher';
// import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './abstract/BaseRule';

export class WithAgeComesWisdomRule extends BaseRule {
  constructor(turnSwitcher: ITurnSwitcher, playersStorage: IPlayersStorage, isRevealed = false) {
    const description = 'With age comes wisdom.';
    const condition = () => turnSwitcher.getTurnsCount() === 100;
    const onTrigger = () => {
      // new RuleLog(
      //   'Children of war, you have grown old. Each player gains five XP.',
      // ).addToQueue();
      playersStorage.getPlayers().forEach((player) => {
        player.xp += 10;
      });
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
