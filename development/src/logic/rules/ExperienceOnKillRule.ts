import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
import { BaseRule } from './BaseRule';

export class ExperienceOnKillRule extends BaseRule {
  constructor(game: Game, isRevealed = false) {
    const index = 2;
    const description = 'Players gain XP on a kill.';
    const condition = game.isPieceKilled;
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      Logger.logRule(`${player.color} received XP for killing another piece.`);
      player.xp++;
    };

    super(game, index, description, isRevealed, condition, onTrigger);
  }
}