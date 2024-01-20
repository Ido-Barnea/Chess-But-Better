import { Item } from './Items';
import { Piece } from '../pieces/Pieces';
import { Logger } from '../../ui/Logger';
import { coinResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { Player } from '../Players';

export class PiggyBank extends Item {
  constructor(position: Position) {
    super('piggy bank', coinResource, position);
  }

  getRandomAmountOfCoins(player: Player, max: number | undefined) {
    max = max || 5;
    return Math.floor(Math.random() * (max - 1)) + 1;
  }

  use(piece: Piece): void {
    const amountOfCoins = this.getRandomAmountOfCoins(piece.player, undefined);
    piece.player.gold += amountOfCoins;
    Logger.logGeneral(`
      ${piece.player.color} ${piece.name} opened a ${this.name} and recieved ${amountOfCoins} gold coins.
    `);
  }

  drop(player: Player): void {
    const amountOfCoins = this.getRandomAmountOfCoins(player, player.gold);
    player.gold -= amountOfCoins;
    Logger.logGeneral(`${player.color} dropped a ${this.name} and lost ${amountOfCoins} gold coins.`);
  }
}