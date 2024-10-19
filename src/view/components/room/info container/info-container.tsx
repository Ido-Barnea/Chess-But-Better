import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Stack } from '@mui/material';
import { ITurnSwitcher } from '../../../../controller/game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { Player } from '../../../../controller/game-state/storages/players-storage/Player';
import { IPlayersStorage } from '../../../../controller/game-state/storages/players-storage/abstract/IPlayersStorage';
import { isEqual } from 'lodash';

interface InfoContainerProps {
  turnSwitcher: ITurnSwitcher;
  playersStorage: IPlayersStorage;
};

interface RoundInfo {
  round: number,
  move: number,
  currentPlayer: Player | undefined,
};

export const InfoContainer: React.FC<InfoContainerProps> = (props) => {
  const [roundInfo, setRoundInfo] = useState<RoundInfo>({ round: 0, move: 0, currentPlayer: undefined, });

  useEffect(() => {
    const handleTurnChange = (currentPlayer: Player) => {
      const round = Math.round(props.turnSwitcher.getTurnsCount() / 2);
      const move = props.turnSwitcher.getTurnsCount();

      setRoundInfo({ round, move, currentPlayer });
    };

    props.turnSwitcher.subscribeToTurnChanges({
      onTurnChange: handleTurnChange,
    });

    return () => {
      props.turnSwitcher.unsubscribeFromTurnChanges({
        onTurnChange: handleTurnChange,
      });
    }
  }, [props.turnSwitcher]);

  return (
    <Table sx={{ mt: 5 }}>
      <TableBody>
        <TableRow>
          <TableCell sx={{ textAlign: 'center', borderBottom: 'none' }} colSpan={3}>
            <Box>
              <Typography variant='h6' fontWeight='bold' sx={{ color: 'white'}}>Round: {roundInfo.round}</Typography>
              <Typography variant='subtitle1' fontWeight='bold' sx={{ color: 'var(--gray-color)' }}>
                Move: {roundInfo.move}
              </Typography>
              <Stack direction='row' spacing={2} justifyContent='center'>
                {
                  props.playersStorage.getPlayers().map(player => {
                    const isCurrentPlayer = isEqual(roundInfo.currentPlayer, player);
                    const playerHighlightColor = isCurrentPlayer ? 'var(--accent-color)' : 'var(--gray-color)';

                    return (
                      <Typography variant='h6' fontWeight='bold' sx={{ color: playerHighlightColor }}>
                        {player.color}
                      </Typography>
                    );
                  })
                }
              </Stack>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow id="info-container-players"></TableRow>
      </TableBody>
    </Table>
  );
};