import { FC } from "react";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { useDrag } from "react-dnd";
import { Box } from "@mui/material";

interface PieceProps {
    piece: BasePiece;
}

export const Piece: FC<PieceProps> = ({piece}) => {
    const Resource = piece.resource.resource;

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'PIECE',
        item: { from: piece.position },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <Box
            ref={drag}
            sx={{
                width: "4rem",
                height: "4rem",
                fill: piece.team.name,
                opacity: isDragging ? 0.5 : 1,
                cursor: "grab",
                transform: 'translate(0, 0)',
            }}
        >
            <Resource width="100%" height="100%" {...(Resource as any)} />
        </Box>
    );
};
