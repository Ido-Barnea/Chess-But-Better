import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useGame } from '../../../utility/context/game-context';
import { EventType } from '../../../controller/events/Events';
import { PlayersTab } from './players-tab';
import { TurnInfo } from './turn-info';

export const PlayerView: FC = () => {
  const { game } = useGame();

  const [_, setForceUpdate] = useState(false);
  const forceUpdate = () => {
    setForceUpdate((prev) => !prev);
  };

  useEffect(() => {
    game.eventEmitter.on(EventType.END_OF_TURN, forceUpdate);

    return () => {
      game.eventEmitter.on(EventType.END_OF_TURN, forceUpdate);
    };
  }, []);

  return (
    <Box sx={{
      height: '100%',
      paddingTop: '2rem',
      paddingBottom: '2rem',
      paddingLeft: '4rem',
      paddingRight: '4rem',
      backgroundColor: '#d5b07c',
    }}>
      <TurnInfo />
      <PlayersTab />
    </Box>
  );
};
