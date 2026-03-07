// TransferForm.jsx — FULL FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Card, CardContent, TextField, Button,
  Typography, Box, MenuItem, InputAdornment,
  CircularProgress, Paper, Divider, Alert,
} from '@mui/material';
import {
  MdSend, MdArrowBack, MdAttachMoney,
  MdDescription, MdSwapVert, MdWarning,
} from 'react-icons/md';
import { FaWallet } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { transfer } from '../../redux/slices/transactionSlice';
import { fetchAccounts } from '../../redux/slices/accountSlice';
import { formatCurrency } from '../../utils/formatters';

const TransferForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accounts } = useSelector((state) => state.account);
  const { loading } = useSelector((state) => state.transaction);

  const maxTransferLimit = 50000;

  const [formData, setFormData] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (accounts?.length > 0 && !formData.fromAccountNumber) {
      setFormData((prev) => ({
        ...prev,
        fromAccountNumber: accounts[0].accountNumber,
      }));
    }
  }, [accounts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const fromAccount = accounts?.find(
    (acc) => acc.accountNumber === formData.fromAccountNumber
  );
  const toAccount = accounts?.find(
    (acc) => acc.accountNumber === formData.toAccountNumber
  );

  const hasInsufficientFunds =
    formData.amount &&
    fromAccount &&
    parseFloat(formData.amount) > parseFloat(fromAccount.balance);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fromAccountNumber || !formData.toAccountNumber || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.fromAccountNumber === formData.toAccountNumber) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    const amount = parseFloat(formData.amount);

    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    if (fromAccount && amount > parseFloat(fromAccount.balance)) {
      toast.error('Insufficient funds');
      return;
    }

    if (amount > maxTransferLimit) {
      toast.error(`Maximum transfer limit is ${formatCurrency(maxTransferLimit)}`);
      return;
    }

    const transferData = {
      fromAccountNumber: formData.fromAccountNumber,
      toAccountNumber: formData.toAccountNumber,
      amount,
      description: formData.description || 'Transfer',
    };

    try {
      await dispatch(transfer(transferData)).unwrap();
      toast.success('Transfer successful!');
      await dispatch(fetchAccounts());
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Transfer failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <Container maxWidth="sm">
        <Button startIcon={<MdArrowBack />} onClick={() => navigate('/dashboard')} className="mb-6">
          Back to Dashboard
        </Button>

        <Card className="shadow-hover">
          <CardContent className="p-6">
            <Box className="text-center mb-6">
              <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
                <MdSend className="text-white text-4xl" />
              </div>
              <Typography variant="h5" className="font-heading font-bold text-gray-800 mb-2">
                Transfer Funds
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Move money between your accounts
              </Typography>
            </Box>

            <Alert severity="info" className="mb-6" icon={<MdWarning />}>
              Maximum transfer limit: {formatCurrency(maxTransferLimit)}
            </Alert>

            {/* Account Balance */}
            <Box className="grid grid-cols-2 gap-4 mb-6">
              {fromAccount && (
                <Paper className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <Typography variant="caption" color="textSecondary" className="block mb-1">
                    From Account
                  </Typography>
                  <Typography variant="body2" className="font-semibold mb-1">
                    {fromAccount.accountType}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-purple-600">
                    {formatCurrency(fromAccount.balance)}
                  </Typography>
                </Paper>
              )}
              {toAccount && (
                <Paper className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <Typography variant="caption" color="textSecondary" className="block mb-1">
                    To Account
                  </Typography>
                  <Typography variant="body2" className="font-semibold mb-1">
                    {toAccount.accountType}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-indigo-600">
                    {formatCurrency(toAccount.balance)}
                  </Typography>
                </Paper>
              )}
            </Box>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FROM account */}
              <TextField
                fullWidth select
                label="From Account"
                name="fromAccountNumber"
                value={formData.fromAccountNumber}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaWallet className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              >
                {accounts?.map((acc) => (
                  <MenuItem key={acc.id} value={acc.accountNumber}>
                    <Box className="flex justify-between w-full">
                      <span>{acc.accountType} — {acc.accountNumber.slice(-6)}</span>
                      <span className="text-gray-500 ml-4">{formatCurrency(acc.balance)}</span>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <Box className="flex justify-center py-2">
                <div className="bg-purple-100 p-3 rounded-full">
                  <MdSwapVert className="text-3xl text-purple-600" />
                </div>
              </Box>
              {/* TO account */}
              <TextField
                fullWidth select
                label="To Account"
                name="toAccountNumber"
                value={formData.toAccountNumber}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaWallet className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              >
                {accounts
                  ?.filter((acc) => acc.accountNumber !== formData.fromAccountNumber)
                  .map((acc) => (
                    <MenuItem key={acc.id} value={acc.accountNumber}>
                      <Box className="flex justify-between w-full">
                        <span>{acc.accountType} — {acc.accountNumber.slice(-6)}</span>
                        <span className="text-gray-500 ml-4">{formatCurrency(acc.balance)}</span>
                      </Box>
                    </MenuItem>
                  ))}
              </TextField>

              {/* Amount */}
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                error={hasInsufficientFunds}
                inputProps={{ step: '0.01', min: '0.01', max: maxTransferLimit }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdAttachMoney className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                helperText={
                  hasInsufficientFunds
                    ? 'Insufficient funds'
                    : `Maximum: ${formatCurrency(maxTransferLimit)}`
                }
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdDescription className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                placeholder="E.g., Rent payment, Savings transfer"
              />

              {/* Summary */}
              {formData.amount && fromAccount && toAccount && !hasInsufficientFunds && (
                <Paper className="p-4 bg-purple-50 border-2 border-purple-200">
                  <Typography variant="subtitle2" className="font-semibold mb-3">
                    Transfer Summary
                  </Typography>
                  <Box className="space-y-2">
                    <Box className="flex justify-between">
                      <Typography variant="body2" color="textSecondary">Amount</Typography>
                      <Typography variant="body2" className="font-semibold">
                        {formatCurrency(formData.amount)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box className="flex justify-between">
                      <Typography variant="body2" color="textSecondary">
                        {fromAccount.accountType} balance after
                      </Typography>
                      <Typography variant="body2" className="font-bold text-red-600">
                        {formatCurrency(parseFloat(fromAccount.balance) - parseFloat(formData.amount))}
                      </Typography>
                    </Box>
                    <Box className="flex justify-between">
                      <Typography variant="body2" color="textSecondary">
                        {toAccount.accountType} balance after
                      </Typography>
                      <Typography variant="body2" className="font-bold text-green-600">
                        {formatCurrency(parseFloat(toAccount.balance) + parseFloat(formData.amount))}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              <Button
                type="submit"
                fullWidth variant="contained" size="large"
                disabled={loading || hasInsufficientFunds}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 py-4 text-lg font-semibold"
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : <><MdSend className="mr-2 text-xl" /> Transfer Money</>
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default TransferForm;