import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface SummaryCardProps {
  title: string;
  value: string;
  growth: number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'error' | 'info';
}

const colorMap = {
  primary: { bg: '#e3f2fd', icon: '#1976d2' },
  secondary: { bg: '#f3e5f5', icon: '#9c27b0' },
  warning: { bg: '#fff3e0', icon: '#ff6b35' },
  success: { bg: '#e8f5e9', icon: '#2e7d32' },
  error: { bg: '#ffebee', icon: '#d32f2f' },
  info: { bg: '#e1f5fe', icon: '#0288d1' },
};

function SummaryCard({ title, value, growth, icon, color = 'primary' }: SummaryCardProps) {
  const isPositive = growth >= 0;
  const colors = colorMap[color];

  return (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.icon,
            }}
          >
            {icon}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: isPositive ? 'success.light' : 'error.light',
            }}
          >
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography
              variant="caption"
              fontWeight="600"
              color={isPositive ? 'success.main' : 'error.main'}
            >
              {Math.abs(growth).toFixed(1)}%
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          vs last month
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
