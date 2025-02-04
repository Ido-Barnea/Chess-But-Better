import { Box } from '@mui/material';
import { AppLoader } from './app-loader/app-loader';

export const App = () => {

  return (
    <Box sx={{width: '100%', height: '100vh'}}>
      <AppLoader />
    </Box>
  )
};
