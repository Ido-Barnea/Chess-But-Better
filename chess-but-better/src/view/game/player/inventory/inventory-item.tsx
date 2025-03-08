import { Box } from "@mui/material";
import { FC } from "react";
import { useDrag } from "react-dnd";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";

interface InventoryItemProps {
    item: BaseItem;
}

export const InventoryItem: FC<InventoryItemProps> = ({item}) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'ITEM',
        item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Box ref={drag} sx={{ padding: 1, backgroundColor: "blue", color: "white", borderRadius: 1, opacity: isDragging ? 0.5 : 1, cursor: "grab" }}>
            {item.resource.name}
        </Box>
    );
}
