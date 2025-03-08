import { v4 as uuidv4 } from "uuid";
import { BasePiece } from "../../../piece/abstract/BasePiece";
import { ItemResources } from "../utilities/ItemResources";
import { ItemBehavior } from "./ItemBehavior";

export abstract class BaseItem implements ItemBehavior {
  id: string;
  resource: ItemResources;

  constructor(resource: ItemResources) {
    this.id = uuidv4();
    this.resource = resource;
  }

  abstract onTrigger(agent: BasePiece): void;
  abstract isValidPlacement(target: BasePiece | undefined): boolean;
}
