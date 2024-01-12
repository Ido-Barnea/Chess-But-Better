import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { BaseRule } from './BaseRule';

export class ExperienceOnKillRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 2;
    const description = 'Players gain XP on a kill.';
    const condition = () => game.getIsPieceKilled();
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      Logger.logRule(`${player.color} received XP for killing another piece.`);
      player.xp++;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}