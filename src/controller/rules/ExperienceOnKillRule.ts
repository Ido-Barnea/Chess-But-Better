// import { RuleLog } from '../../ui/logs/Log';
import { Unicorn } from '../pieces/Unicorn';
import { IKillerPieceSwitcher } from '../game state/switchers/killer piece switcher/abstract/IKillerPieceSwitcher';
import { ITurnSwitcher } from '../game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { BaseRule } from './abstract/BaseRule';

export class ExperienceOnKillRule extends BaseRule {
  constructor(turnSwitcher: ITurnSwitcher, killerPieceSwitcher: IKillerPieceSwitcher, isRevealed = false) {
    const description = 'Players gain XP on a kill.';
    const condition = () => !!killerPieceSwitcher.getKillerPiece();
    const onTrigger = () => {
      const player = turnSwitcher.getCurrentPlayer();
      // new RuleLog(
      //   `${player.color} received XP for killing another piece.`,
      // ).addToQueue();
      player.xp++;

      if (killerPieceSwitcher.getKillerPiece() instanceof Unicorn) {
        player.gold++;
      }
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
