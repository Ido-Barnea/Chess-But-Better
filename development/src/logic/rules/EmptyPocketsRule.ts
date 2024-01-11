import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
import { BaseRule } from './BaseRule';

export class EmptyPocketsRule extends BaseRule {
  constructor(game: Game, isRevealed = false) {
    const index = 5;
    const description = 'Empty pockets.';
    let condition = false;
    game.players.forEach((player) => {
      if (player === game.getCurrentPlayer() && player.gold < 0) {
        condition = true;
      }
    });
    const onTrigger = () => {
      game.players.forEach((player) => {
        if (player === game.getCurrentPlayer() && player.gold < 0) {
          Logger.logRule(`${player.color} is in debt. They lose XP for not handling money properly.`);
          player.xp--;
          return;
        }
      });
    };

    super(game, index, description, isRevealed, condition, onTrigger);
  }
}