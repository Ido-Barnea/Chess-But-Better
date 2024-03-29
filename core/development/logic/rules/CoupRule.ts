import { game } from '../../Game';
import { changePieceToAnotherPlayer } from '../../LogicAdapter';
import { RuleLog } from '../../ui/logs/Log';
import { King } from '../pieces/King';
import { BaseRule } from './abstract/BaseRule';

const IN_DEBT_FOR_TURNS_THRESHOLD = 4;

export class CoupRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Coup.';
    const condition = () => {
      let result = false;
      game.getPlayers().forEach((player) => {
        if (
          player.inDebtForTurns === IN_DEBT_FOR_TURNS_THRESHOLD &&
          player === game.getCurrentPlayer()
        ) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      game.getPlayers().forEach((player) => {
        if (
          player.inDebtForTurns === IN_DEBT_FOR_TURNS_THRESHOLD &&
          player === game.getCurrentPlayer()
        ) {
          player.inDebtForTurns = -1;
          const playerPieces = game
            .getPieces()
            .filter((piece) => piece.player === player);
          const desertionSize =
            Math.floor((Math.random() * (playerPieces.length - 1)) / 2) + 1;

          new RuleLog(
            `${player.color} is deep in debt. ${desertionSize} of their pieces desert.`,
          ).addToQueue();

          let desertedPiecesCounter = 0;
          while (desertedPiecesCounter < desertionSize) {
            const randomPieceIndex =
              Math.floor(Math.random() * (playerPieces.length - 1)) + 1;
            const piece = playerPieces[randomPieceIndex];
            if (piece instanceof King) continue;

            changePieceToAnotherPlayer(piece);
            desertedPiecesCounter++;
          }
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
