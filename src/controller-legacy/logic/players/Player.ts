import { ItemsHolder } from '../inventory/abstract/ItemsHolder';
import { PlayerColor } from './types/PlayerColor';

export class Player {
  color: PlayerColor;
  xp: number;
  gold: number;
  inDebtForTurns: number;
  inventory: ItemsHolder;
  usedAbility: boolean;

  constructor(color: PlayerColor, inventory: ItemsHolder) {
    this.color = color;
    this.xp = 0;
    this.gold = 0;
    this.inDebtForTurns = 0;
    this.inventory = inventory;
    this.usedAbility = false;
  }
}
