export const formatPrice = (n?: number | null, currency = '$'): string => {
  if (n == null || Number.isNaN(Number(n))) {
    return `${currency}0.00`;
  }
  const val = Number(n);
  if (val < 0) {
    return `-${currency}${Math.abs(val).toFixed(2)}`;
  }
  return `${currency}${val.toFixed(2)}`;
};

export const formatPercent = (n: number) => `${n}%`;

export const clampPrice = (n: number | null | undefined, min = 0): number => {
  if (n == null || Number.isNaN(Number(n))) return min;
  return Math.max(min, Number(Number(n).toFixed(2)));
};

export const roundPrice = (n: number | null | undefined): number => {
  if (n == null || Number.isNaN(Number(n))) return 0;
  return Number(Number(n).toFixed(2));
};
