import { FC } from "react";
import { useDrop } from "react-dnd";
import { Paper, Typography } from "@mui/material";
import { InventoryItem } from "./inventory-item";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";
import { Key } from "../../../../utility/keys";

interface InventorySlotProps {
    index: number;
    item: BaseItem | undefined;
    onDrop: (index: number, item: BaseItem) => void;
}

export const InventorySlot: FC<InventorySlotProps> = ({index, item, onDrop}) => {
    const [, drop] = useDrop({
        accept: Key.ITEM_KEY,
        drop: (draggedItem: BaseItem) => onDrop(index, draggedItem),
    });

    return (
        <Paper ref={drop} sx={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid gray" }}>
            {item ? <InventoryItem item={item} /> : <Typography color="gray">Empty</Typography>}
        </Paper>
    );
}
