import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';

import { MdTrendingUp, MdArrowBack, MdAttachMoney, MdDescription } from 'react-icons/md';
import { FaWallet } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { deposit } from '../../redux/slices/transactionSlice';
import { fetchAccounts } from '../../redux/slices/accountSlice';
import { formatCurrency } from '../../utils/formatters';

const DepositForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useSelector((state) => state.account?.accounts || []);
  const loading = useSelector((state) => state.transaction?.loading || false);

  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    description: '',
  });

  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    if(token){
    dispatch(fetchAccounts());
    }
  }, [dispatch,token]);   

  useEffect(() => {
    if (account?.length > 0 && !formData.accountNumber) {
      setFormData((prev) => ({
        ...prev,
        accountNumber: account[0].accountNumber,
      }));
    }
  }, [account, formData.accountNumber]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accountNumber || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    if (parseFloat(formData.amount) > 100000) {
      toast.error('Maximum deposit amount is $100000');
      return;
    }

    const depositData = {
      accountNumber: formData.accountNumber,
      amount: parseFloat(formData.amount),
      description: formData.description || 'Deposit',
    };

    try {
      await dispatch(deposit(depositData)).unwrap();

      toast.success('Deposit submission successful!');
      await dispatch(fetchAccounts()).unwrap();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Deposit failed');
    }
  };

  const selectedAccount = account?.find(
    (acc) => acc.accountNumber === formData.accountNumber
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          startIcon={<MdArrowBack />}
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          Back to Dashboard
        </Button>

        <Card className="shadow-hover">
          <CardContent className="p-8">
            {/* Header */}
            <Box className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
                <MdTrendingUp className="text-white text-5xl" />
              </div>
              <Typography variant="h4" className="font-heading font-bold text-gray-800 mb-2">
                Deposit Money
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Add funds to your account
              </Typography>
            </Box>

            {/* Selected Account Info */}
            {selectedAccount && (
              <Paper className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
                <Box className="flex justify-between items-center">
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Current Balance
                    </Typography>
                    <Typography variant="h5" className="font-bold text-green-600">
                      {formatCurrency(selectedAccount.balance)}
                    </Typography>
                  </Box>
                  <FaWallet className="text-4xl text-green-500 opacity-50" />
                </Box>
              </Paper>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Selection */}
              <TextField
                fullWidth
                select
                label="Select Account"
                name="accountNumber"
                value={formData.accountNumber}
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
                {account?.map((account) => (
                  <MenuItem key={account.id} value={account.accountNumber}>
                    <Box className="flex justify-between w-full">
                      <span>
                        {account.accountType} - {account.accountNumber}
                      </span>
                      <span className="text-gray-600 ml-4">
                        {formatCurrency(account.balance)}
                      </span>
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
                inputProps={{
                  step: '0.01',
                  min: '0.01',
                  max: '100000',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdAttachMoney className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                helperText="Maximum: $100,000"
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdDescription className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                placeholder="E.g., Salary deposit, Gift money"
              />

              {/* New Balance Preview */}
              {formData.amount && selectedAccount && (
                <Paper className="p-4 bg-green-50 border-2 border-green-200">
                  <Typography variant="body2" color="textSecondary" className="mb-1">
                    New Balance After Deposit
                  </Typography>
                  <Typography variant="h5" className="font-bold text-green-700">
                    {formatCurrency(
                      parseFloat(selectedAccount.balance) + parseFloat(formData.amount || 0)
                    )}
                  </Typography>
                </Paper>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 py-4 text-lg font-semibold"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <MdTrendingUp className="mr-2 text-xl" />
                    Deposit Money
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default DepositForm;