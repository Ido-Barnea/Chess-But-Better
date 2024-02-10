import { Item } from './Items';
import { Piece } from '../pieces/Piece';
import { Logger } from '../../ui/Logger';
import { piggyBankResource } from '../../ui/Resources';
import { Player } from '../Players';
import { Position } from '../pieces/PiecesUtilities';

export class PiggyBank extends Item {
  constructor(position?: Position) {
    super('piggy bank', piggyBankResource, 1, position);
  }

  getRandomAmountOfCoins(max?: number) {
    max = max || 5;
    return Math.floor(Math.random() * (max - 1)) + 1;
  }

  use(piece: Piece): void {
    const gold = this.getRandomAmountOfCoins();
    piece.player.gold += gold;
    Logger.logGeneral(`
      ${piece.player.color} ${piece.name} opened a ${this.name} and recieved ${gold} gold coins.
    `);
  }

  drop(player: Player): void {
    const gold = this.getRandomAmountOfCoins(player.gold);
    player.gold -= gold;
    Logger.logGeneral(`${player.color} dropped a ${this.name} and lost ${gold} gold coins.`);
  }
}