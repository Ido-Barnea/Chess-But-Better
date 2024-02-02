import { Item } from './Items';
import { Piece } from '../pieces/Piece';
import { Logger } from '../../ui/Logger';
import { coinResource } from '../../ui/Resources';
import { Player } from '../Players';
import { Position } from '../pieces/PiecesUtilities';

export class PiggyBank extends Item {
  constructor(position?: Position) {
    super('piggy bank', coinResource, 1, position);
  }

  getRandomAmountOfCoins(max?: number) {
    max = max || 5;
    return Math.floor(Math.random() * (max - 1)) + 1;
  }

  use(piece: Piece): void {
    const amountOfCoins = this.getRandomAmountOfCoins();
    piece.player.gold += amountOfCoins;
    Logger.logGeneral(`
      ${piece.player.color} ${piece.name} opened a ${this.name} and recieved ${amountOfCoins} gold coins.
    `);
  }

  drop(player: Player): void {
    const amountOfCoins = this.getRandomAmountOfCoins(player.gold);
    player.gold -= amountOfCoins;
    Logger.logGeneral(`${player.color} dropped a ${this.name} and lost ${amountOfCoins} gold coins.`);
  }
}