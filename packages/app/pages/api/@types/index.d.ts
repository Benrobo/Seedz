export interface CreateUserType {
  id: string;
  role: "MERCHANT" | "SUPPLIER" | "BUYER";
}

export interface FundWalletType {
  amount: string;
  currency: string;
}
