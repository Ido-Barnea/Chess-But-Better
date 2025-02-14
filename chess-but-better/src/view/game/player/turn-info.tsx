import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useGame } from "../../../utility/context/game-context";
import { Colors } from "../../colors";

export const TurnInfo: FC = () => {
    const { game } = useGame();

    return (
        <Stack sx ={{ width: '100%', display: 'flex', alignItems: 'center' }} direction='column'>
            <Typography variant='h6' color={Colors.PRIMARY} fontWeight='bold'>
                Round: {game.turnCounter.getRoundCount()}
            </Typography>
            <Typography variant='body2' color={Colors.ACCENT} fontWeight='bold'>
                Move: {game.turnCounter.getTurnCount()}
            </Typography>
        </Stack>
    );
};
