import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useGame } from "../../../utility/context/game-context";

export const TurnInfo: FC = () => {
    const { game } = useGame();

    return (
        <Stack sx ={{ width: '100%', display: 'flex', alignItems: 'center' }} direction='column'>
            <Typography variant='h6' color='#892201' fontWeight='bold'>
                Round: {game.turnCounter.getRoundCount()}
            </Typography>
            <Typography variant='body2' color='#997d59' fontWeight='bold'>
                Move: {game.turnCounter.getTurnCount()}
            </Typography>
        </Stack>
    );
};
