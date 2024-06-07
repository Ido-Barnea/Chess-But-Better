import { IFellOffTheBoardPieceSwitcher } from '../game state/switchers/fell off the board piece switcher/abstract/IFellOffTheBoardPieceSwitcher';
import { ITurnSwitcher } from '../game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { BaseRule } from './abstract/BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(
    turnSwitcher: ITurnSwitcher,
    fellOffTheBoardPieceSwitcher: IFellOffTheBoardPieceSwitcher,
    isRevealed = false
  ) {
    const description = 'Pieces can fall off the board.';
    const condition = () => !!fellOffTheBoardPieceSwitcher.getPiece();
    const onTrigger = () => {
      return;
    };

    super(description, isRevealed, condition, onTrigger, turnSwitcher);
  }
}
