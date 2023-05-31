const formatNumberToCurrency = (amount: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(amount));
};

export { formatNumberToCurrency };
