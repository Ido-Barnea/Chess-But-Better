import { FC } from "react";
import { BaseBoard } from "../../../model/board/abstract/BaseBoard";
import { Coordinates } from "../../../model/piece/utilities/position/Coordinates";
import { Box } from "@mui/material";

interface TileProps {
  board: BaseBoard;
  coordinates: Coordinates;
}

export const Tile: FC<TileProps> = ({board, coordinates}) => {
  const isDark = (coordinates.x + coordinates.y) % 2 !== 0;

  return (
    <Box
      sx={{
        width: '5rem',
        height: '5rem',
        backgroundColor: isDark ? board.colors.dark : board.colors.light,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
      }}
    ></Box>
  );
};
