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
  category: "FARM_PRODUCE" | "FARM_MACHINERY" | "";
  price: number;
  availableForRent: boolean;
  rentingPrice: string;
  quantity: number;
  // images: {
  //   hash: string;
  //   url: string;
  // };
  description: string;
}

export interface ApiAddProductProp {
  name: string;
  category: "FARM_PRODUCE" | "FARM_MACHINERY";
  price: number;
  availableForRent: boolean;
  rentingPrice: price;
  quantity: number;
  image: {
    hash: string;
    url: string;
  };
  description: string;
}

export interface AllProductProp {
  id: string;
  name: string;
  category: "FARM_PRODUCE" | "FARM_MACHINERY";
  price: number;
  availableForRent: boolean;
  rentingPrice: price;
  quantity: number;
  image: {
    hash: string;
    url: string;
  };
  description: string;
  ratings: {
    rate;
  };
}

export interface ApiProductCheckoutProps {
  totalAmount: number;
  productQty: ProductQty[];
}

type ProductQty = {
  prodId: string;
  qty: number;
  name: string;
  // amount: number;
};

export type SeedzAiPayload = {
  question: string;
  lang: string;
};
