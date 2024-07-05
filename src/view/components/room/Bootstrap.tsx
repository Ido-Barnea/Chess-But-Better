import React, { useEffect, useState } from 'react';
import { Room } from './room';
import { Bootstrapper } from '../../../controller/Bootstrapper';
import { IEndOfMoveHandlersNotifier } from '../../../controller/handlers/abstract/IEndOfMoveHandlersNotifier';
import { IMovesCounter } from '../../../controller/game state/counters/moves counter/abstract/IMovesCounter';
import { ITurnSwitcher } from '../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { IPiecesStorage } from '../../../controller/game state/storages/pieces storage/abstract/IPiecesStorage';
import { IBootstrapTools } from '../../../controller/actions/types/BootstrapTools.Type';

export const Bootstrap = () => {
  const [tools, setTools] = useState<IBootstrapTools | undefined>();

  useEffect(() => {
    const init = () => {
      try {
        setTools(new Bootstrapper().getTools());
      } catch (error) {
        console.error('Initialization failed', error);
      }
    };

    init();
  }, []);

  // Return ErrorPage on error like 'oops, something went wrong'?
  return <>{tools && <Room tools={tools} />}</>;
};
