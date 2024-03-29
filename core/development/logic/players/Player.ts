import { PlayerInventory } from '../inventory/PlayerInventory';
import { PlayerColor } from './PlayerColor';

export class Player {
  color: PlayerColor;
  xp: number;
  gold: number;
  inDebtForTurns: number;
  inventory: PlayerInventory;

  constructor(color: PlayerColor) {
    this.color = color;
    this.xp = 0;
    this.gold = 0;
    this.inDebtForTurns = 0;
    this.inventory = new PlayerInventory();
  }
}
