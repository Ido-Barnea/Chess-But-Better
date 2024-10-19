import { IPlayersStorage } from '../game-state/storages/players-storage/abstract/IPlayersStorage';
import { ITurnSwitcher } from '../game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
// import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './abstract/BaseRule';

export class EmptyPocketsRule extends BaseRule {
  constructor(turnSwitcher: ITurnSwitcher, playersStorage: IPlayersStorage, isRevealed = false) {
    const description = 'Empty pockets.';
    const condition = () => {
      let result = false;
      playersStorage.getPlayers().forEach((player) => {
        if (
          player === turnSwitcher.getCurrentPlayer() &&
          player.gold < 0
        ) {
          result = true;
        }
      });
      return result;
    };
    const onTrigger = () => {
      playersStorage.getPlayers().forEach((player) => {
        if (
          player === turnSwitcher.getCurrentPlayer() &&
          player.gold < 0
        ) {
          // new RuleLog(
          //   `${player.color} is in debt. They lose XP for not being prudent.`,
          // ).addToQueue();
          // new RuleLog(
          //   `${player.color} is in debt. Soon, some of their pieces might desert!`,
          // ).addToQueue();
          player.xp--;
          return;
        }
      });
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
