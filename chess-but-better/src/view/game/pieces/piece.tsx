import { FC } from "react";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { useDrag } from "react-dnd";
import { Box } from "@mui/material";

interface PieceProps {
    piece: BasePiece;
}

export const Piece: FC<PieceProps> = ({piece}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "PIECE",
        item: { from: piece.position.coordinates },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));
    const Resource = piece.resource.resource;

    return (
        <Box
            ref={drag}
            sx={{
                width: "4rem",
                height: "4rem",
                fill: piece.team.name,
                opacity: isDragging ? 0.5 : 1,
                cursor: "grab",
            }}
        >
            <Resource width="100%" height="100%" {...(Resource as any)} />
        </Box>
    );
};
