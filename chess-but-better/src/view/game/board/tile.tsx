import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import { Piece } from "../pieces/piece";
import { useGame } from "../../../utility/context/game-context";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { Position } from "../../../model/piece/utilities/position/Position";
import { EventType } from "../../../controller/events/Events";
import { BaseItem } from "../../../model/player/inventory/abstract/BaseItem";
import { Key } from "../../../utility/keys";

interface TileProps {
  position: Position,
}

export const Tile: FC<TileProps> = ({position}) => {
  const isDark = (position.coordinates.x + position.coordinates.y) % 2 !== 0;

  const { game } = useGame();

  const [piece, setPiece] = useState<BasePiece | undefined>(game.piecesService.getPieceByPosition(position));

  const updatePiece = () => {
    const updatedPiece = game.piecesService.getPieceByPosition(position);
    setPiece(updatedPiece);
  };

  useEffect(() => {}, [
    game.eventEmitter.on(EventType.AFTER_PIECE_MOVED, updatePiece),
    game.eventEmitter.on(EventType.AFTER_PIECE_KILLED, updatePiece),
    game.eventEmitter.on(EventType.AFTER_PIECE_SPAWNED, updatePiece),
  ]);

  const tileDropCases: Record<Key, Function> = {
    [Key.PIECE_KEY]: (piece: BasePiece) => game.boardService.movePiece(piece, position),
    [Key.ITEM_KEY]: (item: BaseItem) => console.log(item),
  }

  const [_, drop] = useDrop(() => ({
    accept: [Key.PIECE_KEY, Key.ITEM_KEY],
    drop: (item: {
      type: Key,
      value: BasePiece | BaseItem,
    }) => {
      tileDropCases[item.type](item.value);
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
      {piece && <Piece key={piece.resource.name} piece={piece} />}
    </Box>
  );
};
