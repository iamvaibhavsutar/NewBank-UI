import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Box } from '@mui/material';
import { fetchAccounts } from '../../redux/slices/accountSlice';
import { fetchTransactions } from '../../redux/slices/transactionSlice';
import TotalBalanceCard from './TotalBalanceCard';
import QuickActions from './QuickActions';
import AccountCard from './AccountCard';
import TransactionList from './TransactionList';
import LoadingSpinner from '../common/LoadingSpinner';
import { useLocation, useNavigation } from 'react-router-dom';



const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const accounts = useSelector((state) => state.account?.accounts || []);
  const selectedAccount = useSelector((state) => state.account?.selectedAccount);
  const loading = useSelector((state) => state.account?.loading || false);

  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch, token, location.key]);

  useEffect(() => {
    if (selectedAccount) {
      dispatch(fetchTransactions(selectedAccount.accountNumber));
    }
  }, [selectedAccount, dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" className="py-8">
      <Grid container spacing={3}>
        {/* Total Balance */}
        <Grid size={12}>
          <TotalBalanceCard accounts={accounts} />
        </Grid>

        {/* Quick Actions */}
        <Grid size={12}>
          <QuickActions />
        </Grid>

        {/* Account Cards */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className="space-y-4">
            {(accounts || []).map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </Box>
        </Grid>

        {/* Transaction List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TransactionList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;