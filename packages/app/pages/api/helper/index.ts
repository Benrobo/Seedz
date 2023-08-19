import { customAlphabet, customRandom } from "nanoid";

export function genID(len: number = 10) {
  const nanoid = customAlphabet("1234567890abcdef", 10);
  return nanoid(len);
}

export const CurrencySymbol = {
  NGN: "₦",
  USD: "$",
};

export function formatCurrency(amount: number, currency?: string) {
  const formatedNumber = amount.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  // @ts-ignore
  const curr = CurrencySymbol[currency];
  return `${curr ?? ""}${formatedNumber}`;
}

export function formatNumLocale(amount: number, currency?: string) {
  if (!currency) {
    return amount.toLocaleString("en-US");
  }
  return amount.toLocaleString("en-US", { style: "currency", currency });
}
