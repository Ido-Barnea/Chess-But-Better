import { IMovesCounter } from '../../game state/counters/moves counter/abstract/IMovesCounter';
import { IPiecesStorage } from '../../game state/storages/pieces storage/abstract/IPiecesStorage';
import { ITurnSwitcher } from '../../game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IEndOfMoveHandlersNotifier } from '../../handlers/abstract/IEndOfMoveHandlersNotifier';

export interface IBootstrapTools {
  movesCounter: IMovesCounter;
  endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier;
  turnSwitcher: ITurnSwitcher;
  piecesStorage: IPiecesStorage;
}
