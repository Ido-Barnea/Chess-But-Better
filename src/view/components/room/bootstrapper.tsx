import React, { useEffect, useState } from 'react';
import { Room } from './room';
import { Bootstrapper } from '../../../controller/Bootstrapper';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/game-state/counters/moves-counter/abstract/IMovesCounter';
import { ITurnSwitcher } from '../../../controller/game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { IEditablePiecesStorage } from '../../../controller/game-state/storages/pieces-storage/abstract/IEditablePiecesStorage';
import { IPlayersStorage } from '../../../controller/game-state/storages/players-storage/abstract/IPlayersStorage';

export const Bootstrap = () => {
  const [tools, setTools] = useState<{
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier,
    turnSwitcher: ITurnSwitcher,
    piecesStorage: IEditablePiecesStorage,
    playersStorage: IPlayersStorage,
  } | undefined>();

  useEffect(() => {
    const init = async () => {
      try {
        setTools(await new Bootstrapper().getTools());
      } catch (error) {
        console.error('Initialization failed: ', error);
      }
    };

    init();
  }, []);

  if (!tools) {
    return <div>Loading...</div>;
  }

  return (
    <Room tools={tools} />
  );
}
