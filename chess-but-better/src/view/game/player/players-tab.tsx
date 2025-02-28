import { Box, Stack, Typography } from "@mui/material";
import { FC, useRef } from "react";
import { Player } from "../../../model/player/Player";
import { useGame } from "../../../utility/context/game-context";
import { Colors } from "../../colors";

export const PlayersTab: FC = () => {
    const { game } = useGame();
    
    const players = useRef(game.playersStorage.getPlayers());

    const isPlayersTurn = (player: Player): boolean => {
        const currentPlayer = game.turnCounter.getCurrentPlayer();
        return currentPlayer.name === player.name;
    };

    return (
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
            {players.current.map((player, index) => (
            <Box
                key={index}
                sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='button' color={Colors.ACCENT} sx={{ fontWeight: isPlayersTurn(player) ? 'bold' : 'normal' }}>
                    {player.name}
                </Typography>
                <Typography>{player.team.gold} Gold</Typography>
                <Typography>{player.team.experience} XP</Typography>
                </Box>
                <Box sx={{
                    position: 'absolute',
                    left: '100%',
                    bottom: 0, 
                    width: '4px',
                    backgroundColor: player.team.name,
                    height: '60%',
                    }} />
                </Box>
            ))}
        </Stack>
    );
};
