import gql from "graphql-tag";

const userTypeDef = gql`
  type Query {
    getUser(id: String!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(payload: CreateUserMut!): CreateUserMutOutput
  }

  # Beginning of  QUE/MUT Fields
  #   Create user mutation
  input CreateUserMut {
    email: String!
    fullname: String!
    role: String!
    id: String!
  }

  type CreateUserMutOutput {
    success: Boolean
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
    role: Role
    deliveryAddress: [DeliveryAddress]
    transactions: [Transaction]
    wallet: Wallet
    walletId: String
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

export default userTypeDef;
