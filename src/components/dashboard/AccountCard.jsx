import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { MdAccountBalance } from 'react-icons/md';
import { selectAccount } from '../../redux/slices/accountSlice';
import { formatCurrency, formatAccountNumber } from '../../utils/formatters';

const AccountCard = ({ account }) => {
  const dispatch = useDispatch();
  const { selectedAccount } = useSelector((state) => state.account);
  const isSelected = selectedAccount?.id === account.accountId;

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-hover'
          : 'hover:shadow-soft'
      }`}
      onClick={() => dispatch(selectAccount(account))}
    >
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <Box className="flex items-center gap-2">
            <MdAccountBalance className="text-blue-600 text-2xl" />
            <Typography variant="h6" className="font-semibold">
              {account.accountType}
            </Typography>
          </Box>
          <Chip
            label={account.status}
            color="success"
            size="small"
          />
        </Box>
        <Typography variant="body2" color="textSecondary" className="mb-2">
          {formatAccountNumber(account.accountNumber)}
        </Typography>
        <Typography variant="h4" className="font-heading font-bold text-gray-800">
          {formatCurrency(account.balance, account.currency)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AccountCard;