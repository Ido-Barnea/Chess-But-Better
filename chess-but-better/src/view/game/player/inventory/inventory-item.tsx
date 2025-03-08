import { Box } from "@mui/material";
import { FC } from "react";
import { useDrag } from "react-dnd";
import { Item } from "../../../../model/player/inventory/item";

interface InventoryItemProps {
    item: Item;
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
            {item.name}
        </Box>
    );
}
