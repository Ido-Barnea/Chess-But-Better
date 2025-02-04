import { FC } from "react";
import { BaseBoard } from "../../../model/board/abstract/BaseBoard";
import { Tile } from "./tile";
import { Box } from "@mui/material";

interface BoardProps {
  board: BaseBoard;
}

export const Board: FC<BoardProps> = ({board}) => {
  const renderBoard = () => {
    const boardElement = [];
    for (let row = 0; row < board.size.width; row++) {
      const tiles = [];
      for (let col = 0; col < board.size.height; col++) {
        tiles.push(
          <Tile
            key={`${row}-${col}`}
            position={{
              coordinates: {x: col, y: row},
              board: board,
            }} />
        );
      }
      boardElement.push(
        <Box key={row} sx={{ display: 'flex', width: '100%' }}>
          {tiles}
        </Box>
      );
    }
    return boardElement;
  };

  return (
    <>
      {renderBoard()}
    </>
  );
};
