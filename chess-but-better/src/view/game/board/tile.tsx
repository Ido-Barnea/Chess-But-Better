import { FC, useEffect, useState } from "react";
import { BaseBoard } from "../../../model/board/abstract/BaseBoard";
import { Coordinates } from "../../../model/piece/utilities/position/Coordinates";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import { Piece } from "../pieces/piece";
import { useGame } from "../../../utility/context/game-context";
import { EventType } from "../../../controller/events/Events";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";

interface TileProps {
  board: BaseBoard;
  coordinates: Coordinates;
}

export const Tile: FC<TileProps> = ({board, coordinates}) => {
  const isDark = (coordinates.x + coordinates.y) % 2 !== 0;

  const { game } = useGame();
  const [piece, setPiece] = useState<BasePiece | undefined>(game.boardService.getPieceAt(coordinates));

  const updatePiece = () => {
    setPiece(game.boardService.getPieceAt(coordinates));
  };

  useEffect(() => {
    game.eventEmitter.on(EventType.DROP_PIECE, updatePiece);
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PIECE",
    drop: (item: { from: Coordinates }) => {
      game.boardService.movePiece(item.from, coordinates);
      game.eventEmitter.emit(EventType.DROP_PIECE);
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
