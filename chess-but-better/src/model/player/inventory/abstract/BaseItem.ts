import { v4 as uuidv4 } from "uuid";
import { BasePiece } from "../../../piece/abstract/BasePiece";
import { ItemResources } from "../utilities/ItemResources";
import { ItemBehavior } from "./ItemBehavior";
import { Position } from "../../../piece/utilities/position/Position";
import { TileOccupantType } from "../../../../controller/game-state/services/board/TileOccupantType";

export abstract class BaseItem implements ItemBehavior {
  id: string;
  resource: ItemResources;
  position: Position | undefined;

  constructor(resource: ItemResources, position: Position | undefined) {
    this.id = uuidv4();
    this.resource = resource;
    this.position = position;
  }

  abstract onTrigger(agent: BasePiece): void;
  abstract isValidPlacement(occupantType: TileOccupantType): boolean;
}
