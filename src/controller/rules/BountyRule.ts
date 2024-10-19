// import { RuleLog } from '../../ui/logs/Log';
import { MIN_KILLINGS_FOR_BOUNTY } from '../../controller/Constants';
import { BaseRule } from './abstract/BaseRule';
import { ITurnSwitcher } from '../game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { IPiecesStorage } from '../game-state/storages/pieces-storage/abstract/IPiecesStorage';

export class BountyRule extends BaseRule {
  constructor(turnSwitcher: ITurnSwitcher, piecesStorage: IPiecesStorage, isRevealed = false) {
    const description = 'Bounty.';
    const condition = () => {
      let result = false;
      piecesStorage.getPieces().forEach((piece) => {
        if (piece.modifiers.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      piecesStorage.getPieces().forEach((piece) => {
        if (!piece.position) return;
        if (piece.modifiers.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
          const { player, position, resource } = piece;
          // new RuleLog(
          //   `There is an open bounty on a ${player.color} ${resource.name} [${position.coordinates.join(',')}].`,
          // ).addToQueue();
        }
      });
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
