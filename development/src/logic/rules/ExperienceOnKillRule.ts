import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
import { BaseRule } from './BaseRule';

export class ExperienceOnKillRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 2;
    const description = 'Players gain XP on a kill.';
    const condition = Game.isPieceKilled;
    const onTrigger = () => {
      const player = Game.getCurrentPlayer();
      Logger.logRule(`${player.color} received XP for killing another piece.`);
      player.xp++;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}