import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
import { BaseRule } from './BaseRule';

export class EmptyPocketsRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 5;
    const description = 'Empty pockets.';
    let condition = false;
    Game.players.forEach((player) => {
      if (player === Game.getCurrentPlayer() && player.gold < 0) {
        condition = true;
      }
    });
    const onTrigger = () => {
      Game.players.forEach((player) => {
        if (player === Game.getCurrentPlayer() && player.gold < 0) {
          Logger.logRule(`${player.color} is in debt. They lose XP for not handling money properly.`);
          player.xp--;
          return;
        }
      });
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}