import { Box, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGame } from "../../../utility/context/game-context";
import { Board } from "./board";
import { BaseBoard } from "../../../model/board/abstract/BaseBoard";
import { EventType } from "../../../controller/events/Events";
import { Colors } from "../../colors";

export const BoardsView: FC = () => {
  const { game } = useGame();
  
  const [populatedBoards, setPopulatedBoards] = useState<Array<BaseBoard>>(game.boardService.retrievePopulatedBoards());
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  
  const updateBoards = () => {
    setPopulatedBoards(game.boardService.retrievePopulatedBoards());
  };

  useEffect(() => {
    game.eventEmitter.on(EventType.PIECE_SPAWNED, updateBoards);

    return () => {
      game.eventEmitter.off(EventType.PIECE_SPAWNED, updateBoards);
    }
  }, []);

  const switchBoard = (index: number) => {
    setActiveBoardIndex(index);
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.BACKGROUND_DARK,
    }}>
      {/* Left column: Board */}
      <Box sx={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
        {populatedBoards.map((board, index) => (
          <Box
            key={board.name}
            sx={{
              display: activeBoardIndex === index ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Box>
              <Board board={board} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Right column: Buttons */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%',
      }}>
        {populatedBoards.map((board, index) => (
          <Button
            key={board.name}
            variant="contained"
            sx={{height: '7.5rem', width: '7.5rem', margin: '5px', background: board.colors.dark }}
            onClick={() => switchBoard(index)}
          >
            {board.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
