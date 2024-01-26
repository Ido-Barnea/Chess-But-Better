import { game } from '../../Game';
import { changePieceToAnotherPlayer } from '../../LogicAdapter';
import { Logger } from '../../ui/Logger';
import { King } from '../pieces/King';
import { BaseRule } from './BaseRule';

export class CoupRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Coup.';
    const condition = () => {
      let result = false;
      game.getPlayers().forEach((player) => {
        if (player.inDebtForTurns === 3) {
          result = true;
        }
      });
      return result;
    };
    const onTrigger = () => {
      game.getPlayers().forEach((player) => {
        if (player.inDebtForTurns === 3) {
          player.inDebtForTurns = 0;
          const playerPieces = game.getPieces().filter(piece => piece.player === player);
          const randomAmountOfPieces = Math.floor(Math.random() * (playerPieces.length - 1) / 2) + 1;
          Logger.logRule(`${player.color} is deep in debt. ${randomAmountOfPieces} of their pieces desert.`);

          let desertedPiecesCounter = 0;
          playerPieces.forEach(piece => {
            if (desertedPiecesCounter < randomAmountOfPieces && !(piece instanceof King)) {
              changePieceToAnotherPlayer(piece);
              desertedPiecesCounter++;
            }
          });
        }
      });
    };

    super(description, isRevealed, condition, onTrigger);
  }
}