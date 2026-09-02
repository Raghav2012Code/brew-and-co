export const formatPrice = (n: number, currency = '$') => `${currency}${n.toFixed(2)}`;

export const formatPercent = (n: number) => `${n}%`;

export const clampPrice = (n: number) => Math.max(0, Number(n.toFixed(2)));
