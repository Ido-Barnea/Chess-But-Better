import { game } from '../../Game';
import { changePieceToAnotherPlayer } from '../../LogicAdapter';
import { Logger } from '../../ui/Logger';
import { King } from '../pieces/King';
import { BaseRule } from './BaseRule';

export class BountyRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Bounty.';
    const condition = () => {
      let result = false;
      game.getPlayers().forEach((player) => {
        if (player.inDebtForTurns === 2 && player === game.getCurrentPlayer()) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      game.getPlayers().forEach((player) => {
        if (player.inDebtForTurns === 2 && player === game.getCurrentPlayer()) {
          player.inDebtForTurns = -1;
          const playerPieces = game.getPieces().filter(piece => piece.player === player);
          const randomAmountOfPieces = Math.floor(Math.random() * (playerPieces.length - 1) / 2) + 1;
          
          Logger.logRule(`${player.color} is deep in debt. ${randomAmountOfPieces} of their pieces desert.`);

          let desertedPiecesCounter = 0;
          while (desertedPiecesCounter < randomAmountOfPieces) {
            const randomPieceIndex = Math.floor(Math.random() * (playerPieces.length - 1)) + 1;
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
