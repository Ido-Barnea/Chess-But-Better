import { FC } from "react";
import { BaseBoard } from "../../../model/board/abstract/BaseBoard";
import { Coordinates } from "../../../model/piece/utilities/position/Coordinates";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import { Piece } from "../pieces/piece";
import { useGame } from "../../../utility/context/game-context";

interface TileProps {
  board: BaseBoard;
  coordinates: Coordinates;
}

export const Tile: FC<TileProps> = ({board, coordinates}) => {
  const isDark = (coordinates.x + coordinates.y) % 2 !== 0;

  const { game } = useGame();
  const piece = game.boardService.getPieceAt(coordinates);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PIECE",
    drop: (item: { from: Coordinates }) => {
      game.boardService.movePiece(item.from, coordinates);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
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
    >
      {piece && <Piece piece={piece} />}
    </Box>
  );
};
