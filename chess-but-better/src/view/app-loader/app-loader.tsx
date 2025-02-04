import { FC } from "react";
import { Game } from "../game/game";
import { GameProvider } from "../../utility/context/game-context";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const AppLoader: FC = () => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <GameProvider>
          <Game />
        </GameProvider>
      </DndProvider>
    </>
  );
};
