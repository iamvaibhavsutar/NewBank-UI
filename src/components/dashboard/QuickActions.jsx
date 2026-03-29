import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  MdAccountBalance,
  MdTrendingUp,
  MdTrendingDown,
  MdSend,
} from 'react-icons/md';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Account',
      icon: MdAccountBalance,
      color: 'from-blue-500 to-blue-600',
      path: '/create-account',
    },
    {
      title: 'Deposit',
      icon: MdTrendingUp,
      color: 'from-green-500 to-green-600',
      path: '/deposit',
    },
    {
      title: 'Withdraw',
      icon: MdTrendingDown,
      color: 'from-red-500 to-red-600',
      path: '/withdraw',
    },
    {
      title: 'Self A/c Transfer',
      icon: MdSend,
      color: 'from-purple-500 to-purple-600',
      path: '/transfer',
    },
  ];

  return (
    <Grid container spacing={3}>
      {actions.map((action) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.title}>
          <Card
            className="cursor-pointer hover:shadow-hover transition-all transform hover:scale-105"
            onClick={() => navigate(action.path)}
          >
            <CardContent className="text-center p-6">
              <Box className={`inline-flex p-4 rounded-full bg-gradient-to-br ${action.color} mb-3`}>
                <action.icon className="text-white text-3xl" />
              </Box>
              <Typography variant="h6" className="font-semibold">
                {action.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActions;