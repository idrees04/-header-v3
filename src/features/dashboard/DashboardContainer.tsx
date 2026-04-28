import { AppLayout } from '@/components/AppLayout';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function DashboardPage() {
    const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('xl'));
  return (
    <AppLayout>
      <Box sx={{ display: 'grid', gap: 1, minWidth: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
    </Box>
    </AppLayout>
  );
}
