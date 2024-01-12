import { renderRules } from '../../LogicAdapter';
import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
export interface Rule {
  id: number;
  description: string;
  isRevealed: boolean;
  condition: boolean;
  onTrigger: () => void;
  trigger: () => void;
}

export class BaseRule implements Rule {
  id: number;
  description: string;
  isRevealed: boolean;
  condition: boolean;
  onTrigger: () => void;

  constructor(
    id: number,
    description: string,
    isRevealed: boolean,
    condition: boolean,
    onTrigger: () => void,
  ) {
    this.id = id;
    this.description = description;
    this.isRevealed = isRevealed;
    this.condition = condition;
    this.onTrigger = onTrigger;
  }

  trigger() {
    if (this.condition) {
      this.onTrigger();
      if (!this.isRevealed) {
        const player = Game.getCurrentPlayer();
        Logger.logRule(`${player.color} received XP for revealing a new rule: ${this.description}`);
        player.xp++;
        this.isRevealed = true;

        renderRules(this);
      }
    }
  }
}