import { TileOccupantType } from "../../../../controller/game-state/services/board/TileOccupantType";
import { BasePiece } from "../../../piece/abstract/BasePiece";

export interface ItemBehavior {
  onTrigger(agent: BasePiece): void;
  isValidPlacement(occupantType: TileOccupantType): boolean;
}
