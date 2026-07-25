export const CURRENCY_SYMBOL = 'Bs.';
export const CURRENCY_LOCALE = 'es-BO';

export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${CURRENCY_SYMBOL} ${num.toLocaleString(CURRENCY_LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const formatCurrencyShort = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${CURRENCY_SYMBOL} ${num.toLocaleString(CURRENCY_LOCALE, { maximumFractionDigits: 0 })}`;
};
