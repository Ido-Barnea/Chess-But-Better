import { FC } from "react";
import { Box } from "@mui/material";
import { PlayerView } from "./player/player-view";
import { BoardsView } from "./board/boards-view";

export const Game: FC = () => {
  return (
    <Box display='flex' height='100%'>
      {/* Left: Players View (1/3 of screen) */}
      <Box flex={1} minWidth={250}>
        <PlayerView />
      </Box>

      {/* Right: Chess Board (2/3 of screen) */}
      <Box flex={2} minWidth={400} display="flex" justifyContent="center" alignItems="center">
        <BoardsView />
      </Box>
    </Box>
  );
};
