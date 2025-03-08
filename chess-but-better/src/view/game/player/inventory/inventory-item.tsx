import { Box } from "@mui/material";
import { FC } from "react";
import { useDrag } from "react-dnd";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";
import { Key } from "../../../../utility/keys";

interface InventoryItemProps {
    item: BaseItem;
}

export const InventoryItem: FC<InventoryItemProps> = ({item}) => {
    const Resource = item.resource.resource;

    const [{ isDragging }, drag] = useDrag({
        type: Key.ITEM_KEY,
        item: { type: Key.ITEM_KEY, value: item },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Box
            ref={drag}
            sx={{
                width: "4rem",
                height: "4rem",
                opacity: isDragging ? 0.5 : 1,
                cursor: "grab",
                transform: 'translate(0, 0)',
            }}>
            <Resource width="100%" height="100%" {...(Resource as any)} />
        </Box>
    );
}
