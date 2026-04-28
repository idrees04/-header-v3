import { Box, Chip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';


export function DashboardContainer() {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('xl'));
  return (
    <Box sx={{ display: 'grid', gap: 1, minWidth: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
    </Box>
  );
}
