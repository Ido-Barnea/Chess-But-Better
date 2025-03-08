import { FC, useState } from "react";
import { Item } from "../../../../model/player/inventory/item";
import { Grid } from "@mui/material";
import { InventorySlot } from "./inventory-slot";

export const Inventory: FC = () => {
    const [items, setItems] = useState<(Array<Item | undefined>)>([undefined, undefined, undefined, undefined]);

    const handleDrop = (index: number, draggedItem: Item) => {
        setItems((prev) => {
            const newItems = [...prev];
            const oldIndex = newItems.findIndex((i) => i?.id === draggedItem.id);
            if (oldIndex !== -1) newItems[oldIndex] = undefined;
            newItems[index] = draggedItem;
            return newItems;
        });
    };

    return (
        <Grid container spacing={2} sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
            {items.map((item, index) => (
                <Grid item key={index}>
                    <InventorySlot item={item} index={index} onDrop={handleDrop} />
                </Grid>
            ))}
        </Grid>
    );
};
