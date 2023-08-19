export interface CreateUserType {
  id: string;
  role: "MERCHANT" | "SUPPLIER" | "BUYER";
}

export interface FundWalletType {
  amount: number;
  currency: string;
}

export interface UserType {
  email: string;
  username: string;
  fullname: string;
  role: string; // You can replace this with an enum if you have predefined roles
  image: string;
  wallet: {
    id: string;
    balance: string;
    currency: string;
  };
}
