import { BasePiece } from "../../../piece/abstract/BasePiece";
import { ItemResources } from "../utilities/ItemResources";
import { ItemBehavior } from "./ItemBehavior";

export abstract class BaseItem implements ItemBehavior {
  resource: ItemResources;

  constructor(resource: ItemResources) {
    this.resource = resource;
  }

  abstract onTrigger: (agent: BasePiece) => void;
}
