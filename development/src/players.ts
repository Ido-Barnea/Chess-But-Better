import { Inventory } from './items';

export type Player = {
  color: string;
  xp: number;
  gold: number;
  inventory: Inventory;
};
