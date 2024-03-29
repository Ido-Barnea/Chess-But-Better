import { Inventory } from './items/Inventory';

type PlayerType = {
  color: string;
  xp: number;
  gold: number;
  inventory: Inventory;
};

export enum PlayerColors {
  WHITE = 'White',
  BLACK = 'Black',
}

export class Player implements PlayerType {
  color: PlayerColors;
  xp: number;
  gold: number;
  inDebtForTurns: number;
  inventory: Inventory;

  constructor(color: PlayerColors) {
    this.color = color;
    this.xp = 0;
    this.gold = 0;
    this.inDebtForTurns = 0;
    this.inventory = new Inventory(this);
  }
}
