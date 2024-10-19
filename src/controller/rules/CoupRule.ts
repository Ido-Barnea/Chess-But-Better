import { IPiecesStorage } from '../game-state/storages/pieces-storage/abstract/IPiecesStorage';
// import { RuleLog } from '../../ui/logs/Log';
import { King } from '../pieces/King';
import { IPlayersStorage } from '../game-state/storages/players-storage/abstract/IPlayersStorage';
import { ITurnSwitcher } from '../game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { BaseRule } from './abstract/BaseRule';

const IN_DEBT_FOR_TURNS_THRESHOLD = 4;

export class CoupRule extends BaseRule {
  constructor(
    turnSwitcher: ITurnSwitcher,
    playersStorage: IPlayersStorage,
    piecesStorage: IPiecesStorage,
    isRevealed = false
  ) {
    const description = 'Coup.';
    const condition = () => {
      let result = false;
      playersStorage.getPlayers().forEach((player) => {
        if (
          player.inDebtForTurns === IN_DEBT_FOR_TURNS_THRESHOLD &&
          player === turnSwitcher.getCurrentPlayer()
        ) {
          result = true;
        }
      });
      return result;
    };

    const onTrigger = () => {
      playersStorage.getPlayers().forEach((player) => {
        if (
          player.inDebtForTurns === IN_DEBT_FOR_TURNS_THRESHOLD &&
          player === turnSwitcher.getCurrentPlayer()
        ) {
          player.inDebtForTurns = -1;
          const playerPieces = piecesStorage.getPieces((piece) => piece.player === player);
          const desertionSize = Math.floor((Math.random() * (playerPieces.length - 1)) / 2) + 1;

          // new RuleLog(
          //   `${player.color} is deep in debt. ${desertionSize} of their pieces desert.`,
          // ).addToQueue();

          let desertedPiecesCounter = 0;
          while (desertedPiecesCounter < desertionSize) {
            const randomPieceIndex = Math.floor(Math.random() * (playerPieces.length - 1)) + 1;
            const piece = playerPieces[randomPieceIndex];
            if (piece instanceof King) continue;

            piece.player = playersStorage.getPlayers().filter(player => player != piece.player)[0];
            desertedPiecesCounter++;
          }
        }
      });
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
