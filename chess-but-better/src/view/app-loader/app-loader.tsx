import { FC } from "react";
import { Game } from "../game/game";
import { GameProvider } from "../../utility/context/game-context";

export const AppLoader: FC = () => {
  return (
    <>
      <GameProvider>
        <Game />
      </GameProvider>
    </>
  );
};
