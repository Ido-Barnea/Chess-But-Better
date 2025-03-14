import { Box } from "@mui/material";
import { FC } from "react";
import { useDrag } from "react-dnd";
import { Key } from "../../../../utility/keys";
import { Item, ItemProps } from "./item";

export const InventoryItem: FC<ItemProps> = ({item}) => {
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
            <Item item={item} />
        </Box>
    );
}
