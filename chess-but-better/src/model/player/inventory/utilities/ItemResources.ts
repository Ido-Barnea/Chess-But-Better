import { FC } from "react";
import { ItemType } from "../../../../controller/items/types/Items";

export type ItemResources = {
  name: ItemType;
  icon: string;
  resource: FC;
};
