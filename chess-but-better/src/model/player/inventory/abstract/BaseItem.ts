import { randomUUID } from "crypto";
import { BasePiece } from "../../../piece/abstract/BasePiece";
import { ItemResources } from "../utilities/ItemResources";
import { ItemBehavior } from "./ItemBehavior";

export abstract class BaseItem implements ItemBehavior {
  id: string;
  resource: ItemResources;

  constructor(resource: ItemResources) {
    this.id = randomUUID();
    this.resource = resource;
  }

  abstract onTrigger(agent: BasePiece): void;
}
