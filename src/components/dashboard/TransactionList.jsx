import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { MdTrendingUp, MdTrendingDown, MdSend, MdRefresh } from 'react-icons/md';
import { formatCurrency, formatDate, getTransactionColor, getTransactionSign } from '../../utils/formatters';

const EMPTY_ARRAY = [];
const TransactionList = () => {
    const transactions = useSelector(
      (state) => state.transaction?.transactions || []
    );
    const loading = useSelector(
      (state) => state.transaction?.loading || false
    );
  

  const getIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <MdTrendingUp className="text-green-600" />;
      case 'WITHDRAWAL':
        return <MdTrendingDown className="text-red-600" />;
      case 'TRANSFER':
        return <MdSend className="text-blue-600" />;
      default:
        return <MdRefresh />;
    }
  };

  return (
    <Card className="h-full">
      <CardContent>
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-heading font-semibold">
            Recent Transactions
          </Typography>
        </Box>

        {loading ? (
          <Typography color="textSecondary" className="text-center py-8">
            Loading transactions...
          </Typography>
        ) : transactions.length === 0 ? (
          <Typography color="textSecondary" className="text-center py-8">
            No transactions yet
          </Typography>
        ) : (
          <Box className="space-y-3">
           {transactions.slice(0, 10).map((transaction, index) => (
              <Box key={transaction.transactionId || transaction.id || index}> 
                  <Box className="flex items-center justify-between py-2">
                      <Box className="flex items-center gap-3">
                          <Box className={`p-2 rounded-lg`}>
                              {getIcon(transaction.transactionType || transaction.type)}
                          </Box>
                          <Box>
                              <Typography variant="body1" className="font-semibold">
                                  {transaction.transactionType || transaction.type}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                  {formatDate(transaction.transactionDate)}
                              </Typography>
                          </Box>
                      </Box>
                      <Box className="text-right">
                          <Typography variant="h6" className="font-bold">
                              {getTransactionSign(transaction.transactionType || transaction.type)}
                              {formatCurrency(transaction.transactionAmount || transaction.amount)}
                          </Typography>
                          <Chip
                              label={transaction.status}
                              size="small"
                              color={getTransactionColor(transaction.transactionType || transaction.type)}
                          />
                      </Box>
                  </Box>
                  {index < transactions.slice(0, 10).length - 1 && <Divider />}
              </Box>
          ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;