import { FC } from "react";
import { useDrop } from "react-dnd";
import { Item } from "../../../../model/player/inventory/item";
import { Paper, Typography } from "@mui/material";
import { InventoryItem } from "./inventory-item";

interface InventorySlotProps {
    index: number;
    item: Item | undefined;
    onDrop: (index: number, item: Item) => void;
}

export const InventorySlot: FC<InventorySlotProps> = ({index, item, onDrop}) => {
    const [, drop] = useDrop({
        accept: 'ITEM',
        drop: (draggedItem: Item) => onDrop(index, draggedItem),
    });

    return (
        <Paper ref={drop} sx={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid gray" }}>
            {item ? <InventoryItem item={item} /> : <Typography color="gray">Empty</Typography>}
        </Paper>
    );
}
