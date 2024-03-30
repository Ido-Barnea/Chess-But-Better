import { game } from '../../Game';
import { RuleLog } from '../../ui/logs/Log';
import { MIN_KILLINGS_FOR_BOUNTY } from '../../Constants';
import { BaseRule } from './abstract/BaseRule';

export class BountyRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Bounty.';
    const condition = () => {
      let result = false;
      game.getPieces().forEach((piece) => {
        if (piece.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      game.getPieces().forEach((piece) => {
        if (!piece.position) return;
        if (piece.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
          const {
            player: { color: playerColor },
            name: pieceName,
            position: { coordinates: pieceCoordinates },
          } = piece;
          new RuleLog(
            `There is an open bounty on a ${playerColor} ${pieceName} [${pieceCoordinates.join(
              ',',
            )}].`,
          ).addToQueue();
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
