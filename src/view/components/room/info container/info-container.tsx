import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box } from '@mui/material';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';
import { Player } from '../../../../controller/game state/storages/players storage/Player';

interface InfoContainerProps {
  turnSwitcher: ITurnSwitcher;
}

export const InfoContainer: React.FC<InfoContainerProps> = (props) => {
  const [roundInfo, setRoundInfo] = useState({ round: 0, move: 0 });

  useEffect(() => {
    const handleTurnChange = (currentPlayer: Player) => {
      const round = Math.round(props.turnSwitcher.getTurnsCount() / 2);
      const move = props.turnSwitcher.getTurnsCount();

      setRoundInfo({ round, move });
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
            </Box>
          </TableCell>
        </TableRow>
        <TableRow id="info-container-players"></TableRow>
      </TableBody>
    </Table>
  );
};