import { BasePiece } from "../../model/piece/abstract/BasePiece";
import { BaseItem } from "../../model/player/inventory/abstract/BaseItem";
import { ItemResources } from "../../model/player/inventory/utilities/ItemResources";
import { ItemIcon } from "./types/ItemIcons";
import { Items } from "./types/Items";

export class PiggyBank extends BaseItem {
  constructor() {
    const resource: ItemResources = {
      name: Items.PIGGY_BANK,
      icon: ItemIcon.PIGGY_BANK,
      resource: undefined, // TODO: import svg resource
    };

    super(resource);
  }

  onTrigger(agent: BasePiece): void {
    // TODO: implement
  }
}
