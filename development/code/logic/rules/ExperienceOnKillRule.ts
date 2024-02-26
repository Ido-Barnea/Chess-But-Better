import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { BaseRule } from './BaseRule';

export class ExperienceOnKillRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Players gain XP on a kill.';
    const condition = () => !!game.getKillerPiece();
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      new RuleLog(
        `${player.color} received XP for killing another piece.`,
      ).addToQueue();
      player.xp++;
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
