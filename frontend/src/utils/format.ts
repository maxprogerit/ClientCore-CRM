export const currency = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const shortDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const today = (): string => new Date().toISOString().split("T")[0];

export const makeId = (prefix: string): string => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
