import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { InventorySlot } from "./inventory-slot";
import { BaseItem } from "../../../../model/player/inventory/abstract/BaseItem";
import { useGame } from "../../../../utility/context/game-context";
import { EventType } from "../../../../controller/events/Events";

export const Inventory: FC = () => {
    const { game } = useGame();
    const [items, setItems] = useState<(Array<BaseItem | undefined>)>([]);

    const updateItems = () => {
        const inventorySize = 4;
        const currentItems = game.itemsStorage.getItems((item) => !item.position);
        
        const filledItems = new Array(inventorySize).fill(undefined);
        currentItems.forEach((item, index) => {
            filledItems[index] = item;
        });
        
        setItems(filledItems);
    };

    useEffect(() => updateItems, []);

    useEffect(() => {}, [
        game.eventEmitter.on(EventType.AFTER_ITEM_PLACED, updateItems),
    ]);

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
