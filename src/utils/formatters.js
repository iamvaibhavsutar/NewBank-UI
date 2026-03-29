export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if(!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const groups = accountNumber.match(/.{1,4}/g);
  return groups ? groups.join(' ') : accountNumber;
};

export const getTransactionColor = (type) => {
  switch (type) {
    case 'DEPOSIT':
      return 'success';
    case 'WITHDRAWAL':
      return 'error';
    case 'TRANSFER':
      return 'primary';
    default:
      return 'default';
  }
};

export const getTransactionSign = (type) => {
  switch (type) {
    case 'DEPOSIT':
      return '+';
    case 'WITHDRAWAL':
      return '-';
    case 'TRANSFER':
      return '−';
    default:
      return '';
  }
};