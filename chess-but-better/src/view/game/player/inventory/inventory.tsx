import { FC, useState } from "react";
import { Grid } from "@mui/material";
import { InventorySlot } from "./inventory-slot";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";
import { PiggyBank } from "../../../../controller/items/PiggyBank";

export const Inventory: FC = () => {
    const [items, setItems] = useState<(Array<BaseItem | undefined>)>([new PiggyBank(), undefined, undefined, undefined]);

    const handleDrop = (index: number, draggedItem: BaseItem) => {
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
