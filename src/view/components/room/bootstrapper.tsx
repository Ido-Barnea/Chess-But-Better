import React, { useEffect, useState } from 'react';
import { Room } from './room';
import { Bootstrapper } from '../../../controller/Bootstrapper';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { ITurnSwitcher } from '../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';

export const Bootstrap = () => {
  const [tools, setTools] = useState<{
    movesCounter: IMovesCounter,
    endOfMoveHandlersNotifier: IEndOfMoveHandlersNotifier,
    turnSwitcher: ITurnSwitcher,
  } | undefined>();

  useEffect(() => {
    const init = async () => {
      try {
        setTools(await new Bootstrapper().getTools());
      } catch (error) {
        console.error('Initialization failed', error);
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
