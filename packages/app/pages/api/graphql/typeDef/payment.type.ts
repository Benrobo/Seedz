import gql from "graphql-tag";

const paymentTypeDef = gql`
  type Query {
    getWalletInfo: Wallet
  }

  type Mutation {
    fundWallet(payload: WalletTopUp): WalletTopUpRes
  }

  # Beginning of  QUE/MUT Fields
  #   Wallet topUp
  input WalletTopUp {
    amount: String
    currency: String
  }

  type WalletTopUpRes {
    authorization_url: String
    access_code: String
    reference: String
  }

  #   End of QUE/MUT Fields

  enum Role {
    MERCHANT
    SUPPLIER
    BUYER
  }

  type User {
    id: String
    email: String
    username: String
    fullname: String
    image: String
    role: Role
    deliveryAddress: [DeliveryAddress]
    transactions: [Transaction]
    wallet: Wallet
  }

  type DeliveryAddress {
    id: String!
    street: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  type Wallet {
    id: String!
    balance: Float
    currency: String
    paystackId: String
  }

  type Transaction {
    id: String!
    type: String
    amount: Float
    description: String
    createdAt: String
  }
`;

export default paymentTypeDef;
