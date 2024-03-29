import { Item } from './Items';
import { piggyBankResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { Log } from '../../ui/logs/Log';
import { getPieceByPosition } from '../Utilities';

export class PiggyBank extends Item {
  constructor(position?: Position) {
    super('piggy bank', piggyBankResource, 1, position);
  }

  getRandomAmountOfCoins(max?: number) {
    max = max || 5;
    return Math.floor(Math.random() * max) + 1;
  }

  use(position: Position): void {
    const piece = getPieceByPosition(position);
    if (!piece) return;

    const gold = this.getRandomAmountOfCoins();
    piece.player.gold += gold;

    const {
      player: { color: pieceColor },
      name: pieceName,
    } = piece;
    new Log(
      `${pieceColor} ${pieceName} claimed a ${this.name} and recieved ${gold} gold coins.`,
    ).addToQueue();
  }
}
