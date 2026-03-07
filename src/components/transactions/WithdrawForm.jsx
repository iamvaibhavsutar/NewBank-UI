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
  Alert,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';

import { MdTrendingDown, MdArrowBack, MdAttachMoney, MdDescription, MdWarning } from 'react-icons/md';
import { FaWallet } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { withdraw } from '../../redux/slices/transactionSlice';
import { fetchAccounts } from '../../redux/slices/accountSlice';
import { formatCurrency } from '../../utils/formatters';

const withdrawForm =() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { account } = useSelector((state) => state.account);
    const { loading } = useSelector((state) => state.transaction);

    const dailyLimit = 10000;
    const [formData, setFormData] = useState({
        accountNumber: '',
        amount: '',
        description: '', 
    });

    useEffect(() => {
      //  dispatch(fetchAccounts());
    }, [dispatch]);

    useEffect(() => {
        if(account?.length > 0 && !formData.accountNumber) {
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

        if (parseFloat(formData.amount) > 100000) {
            toast.error('Maximum withdrawal amount is $100,000');
            return;
        }

        if (parseFloat(formData.amount) < 1) {
            toast.error('Minimum withdrawal amount is $1');
            return;
        }
    

        const WithdrawData = {
            accountNumber: formData.accountNumber,
            amount: parseFloat(formData.amount),
            description: formData.description || 'Withdraw',
        };

        try{
            await dispatch(withdraw(WithdrawData)).unwrap();
            toast.success('Withdraw submission Successful!');
            await dispatch(fetchAccounts()); 
            navigate('/dashboard');
        } catch(error){
            toast.error(error || 'Withdraw Failed');
        };
    };

        const selectedAccount = account?.find(
            (acc) => acc.accountNumber === formData.accountNumber
        );

        const hasInsufficientFunds = Boolean(
            formData.amount && selectedAccount && parseFloat(formData.amount) > parseFloat(selectedAccount.balance));

        return (
            <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8'>
                <Container maxWidth="sm">
                    <Button
                        startIcon={<MdArrowBack />}
                        onClick={() => navigate('/dashboard')}
                        className="mb-6"
                    >
                        Back to Dashboard
                    </Button>
                    <Card className="shadow-hover">
                        <CardContent className='p-8'>
                            <Box className='text-center mb-8'>
                                <div className='inline-flex p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-4'>
                                    <MdTrendingDown className="text-white text-5xl" />
                                </div>
                                
                                <Typography variant="h4" className="font-heading font-bold text-gray-800 mb-2">
                                    Withdraw Money
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Withdraw funds from your account
                                </Typography>
                            </Box>
                            <Alert severity="info" className="mb-6" icon={<MdWarning />}>
                                Daily Withdrawal limit: {formatCurrency(dailyLimit)} 
                            </Alert>

                            {selectedAccount && (
                                        <Paper className="p-4 mb-6 bg-gradient-to-r from-red-50 to-pink-50">
                                            <Box className="flex justify-between items-center">
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">
                                                Available Balance
                                                </Typography>
                                                <Typography variant="h5" className="font-bold text-red-600">
                                                {formatCurrency(selectedAccount.balance)}
                                                </Typography>
                                            </Box>
                                            <FaWallet className="text-4xl text-red-500 opacity-50" />
                                            </Box>
                                        </Paper>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5">
              
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
                                    <MenuItem key={account.accountId} value={account.accountNumber}>
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
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    error={hasInsufficientFunds}
                                    inputProps={{
                                    step: '0.01',
                                    min: '0.01',
                                    max: dailyLimit,
                                    }}
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
                                        : `Maximum: ${formatCurrency(dailyLimit)} per day`
                                    }
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
                                    placeholder="E.g., ATM withdrawal, Cash needed"
                                />

                                {/* New Balance Preview */}
                                {formData.amount && selectedAccount && !hasInsufficientFunds && (
                                    <Paper className="p-4 bg-red-50 border-2 border-red-200">
                                    <Typography variant="body2" color="textSecondary" className="mb-1">
                                        Balance After Withdrawal
                                    </Typography>
                                    <Typography variant="h5" className="font-bold text-red-700">
                                        {formatCurrency(
                                        parseFloat(selectedAccount.balance) - parseFloat(formData.amount || 0)
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
                                    disabled={loading || hasInsufficientFunds}
                                    className="bg-gradient-to-r from-red-500 to-pink-600 py-4 text-lg font-semibold"
                                >
                                    {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                    ) : (
                                    <>
                                        <MdTrendingDown className="mr-2 text-xl" />
                                        Withdraw Money
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

export default withdrawForm;