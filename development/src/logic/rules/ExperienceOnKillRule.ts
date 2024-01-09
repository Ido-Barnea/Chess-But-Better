import { Logger } from '../../ui/Logger';
import { getCurrentPlayer, isPieceKilled } from '../GameController';
import { BaseRule } from './BaseRule';

export class ExperienceOnKillRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 2;
    const description = 'Players gain XP on a kill.';
    const condition = isPieceKilled;
    const onTrigger = () => {
      const player = getCurrentPlayer();
      Logger.logRule(`${player.color} received XP for killing another piece.`);
      player.xp++;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}