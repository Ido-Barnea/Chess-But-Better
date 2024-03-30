import { BaseItem } from './abstract/Item';
import { piggyBankResource } from '../../ui/Resources';
import { Log } from '../../ui/logs/Log';
import { getPieceByPosition } from '../Utilities';
import { ItemActionResult } from './types/ItemActionResult';
import { Position } from '../pieces/types/Position';

export class PiggyBank extends BaseItem {
  constructor(position?: Position) {
    super('piggy bank', piggyBankResource, 1, position);
  }

  getRandomAmountOfCoins(max?: number) {
    max = max || 5;
    return Math.floor(Math.random() * max) + 1;
  }

  use(position: Position): ItemActionResult {
    const piece = getPieceByPosition(position);
    if (!piece) return ItemActionResult.FAILURE;

    const gold = this.getRandomAmountOfCoins();
    piece.player.gold += gold;

    const {
      player: { color: pieceColor },
      name: pieceName,
    } = piece;

    new Log(
      `${pieceColor} ${pieceName} claimed a ${this.name} and recieved ${gold} gold coins.`,
    ).addToQueue();

    return ItemActionResult.SUCCESS;
  }
}
