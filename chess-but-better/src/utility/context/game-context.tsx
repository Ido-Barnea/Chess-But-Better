import { ReactNode, createContext, useContext } from "react";
import { Game } from "../../controller/game-state/Game";

interface GameContextProps {
  game: Game;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const game = new Game();

  return (
    <GameContext.Provider value={{ game }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
