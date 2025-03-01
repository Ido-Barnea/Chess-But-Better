import { BasePiece } from "../../../piece/abstract/BasePiece";

export interface ItemBehavior {
  onTrigger: (agent: BasePiece) => void;
}
