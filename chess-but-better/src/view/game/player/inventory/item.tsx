import { Box } from "@mui/material";
import { FC } from "react";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";

export interface ItemProps {
  item: BaseItem;
}

export const Item: FC<ItemProps> = ({item}) => {
  const Resource = item.resource.resource;

  return (
    <Box
      sx={{
          width: "4rem",
          height: "4rem",
      }}>
      <Resource width="100%" height="100%" {...(Resource as any)} />
    </Box>
  );
}
