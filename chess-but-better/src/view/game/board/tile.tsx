import { FC, useEffect, useState } from "react";
import { Coordinates } from "../../../model/piece/utilities/position/Coordinates";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import { Piece } from "../pieces/piece";
import { useGame } from "../../../utility/context/game-context";
import { EventType } from "../../../controller/events/Events";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { Position } from "../../../model/piece/utilities/position/Position";

interface TileProps {
  position: Position,
}

export const Tile: FC<TileProps> = ({position}) => {
  const isDark = (position.coordinates.x + position.coordinates.y) % 2 !== 0;

  const { game } = useGame();
  const [piece, setPiece] = useState<BasePiece | undefined>(game.boardService.getPieceAt(position));

  const updatePiece = () => {
    setPiece(game.boardService.getPieceAt(position));
  };

  useEffect(() => {
    game.eventEmitter.on(EventType.DROP_PIECE, updatePiece);
  }, []);

  const [_, drop] = useDrop(() => ({
    accept: 'PIECE',
    drop: (item: { from: Coordinates }) => {
      game.boardService.movePiece({coordinates: item.from, board: position.board}, position);
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
        backgroundColor: isDark ? position.board.colors.dark : position.board.colors.light,
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
