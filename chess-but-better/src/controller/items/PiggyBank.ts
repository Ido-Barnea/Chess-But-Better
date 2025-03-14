import { BasePiece } from "../../model/piece/abstract/BasePiece";
import { BaseItem } from "../../model/player/inventory/abstract/BaseItem";
import { ItemResources } from "../../model/player/inventory/utilities/ItemResources";
import { ItemIcon } from "./types/ItemIcons";
import { Items } from "./types/Items";
import PiggyBankResource from '../../assets/images/items/PiggyBankResource.svg?react';
import { TileOccupantType } from "../game-state/services/board/TileOccupantType";
import { Position } from "../../model/piece/utilities/position/Position";

export class PiggyBank extends BaseItem {
  private MIN_COIN_COUNT = 1;
  private MAX_COIN_COUNT = 5;

  constructor(position: Position | undefined) {
    const resource: ItemResources = {
      name: Items.PIGGY_BANK,
      icon: ItemIcon.PIGGY_BANK,
      resource: PiggyBankResource,
    };

    super(resource, position);
  }

  private getRandomGoldAmount = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  onTrigger(agent: BasePiece): void {
    const goldCount = this.getRandomGoldAmount(this.MIN_COIN_COUNT, this.MAX_COIN_COUNT);
    agent.team.gold += goldCount;
  }

  isValidPlacement(occupantType: TileOccupantType): boolean {
    return occupantType === TileOccupantType.EMPTY; 
  }
}
