import { Inventory } from './items';

type PlayerType = {
  color: string;
  xp: number;
  gold: number;
  inventory: Inventory;
};

export class Player implements PlayerType {
  color: string;
  xp: number;
  gold: number;
  inventory: Inventory;

  constructor(color: string) {
    this.color = color;
    this.xp = 0;
    this.gold = 0;
    this.inventory = new Inventory();
  }
}
