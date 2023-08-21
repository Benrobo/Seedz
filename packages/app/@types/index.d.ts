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

export interface AddProductInfoType {
  name: string;
  category: "FARM_PRODUCE" | "FARM_MACHINERY";
  price: string;
  availableForRent: boolean;
  rentingPrice: string;
  images: {
    hash: string;
    base64: string;
  };
  description: string;
}

export interface ApiAddProductProp {
  name: string;
  category: "FARM_PRODUCE" | "FARM_MACHINERY";
  price: number;
  availableForRent: boolean;
  rentingPrice: price;
  image: {
    hash: string;
    url: string;
  };
  description: string;
}
