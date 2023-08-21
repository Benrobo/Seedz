import gql from "graphql-tag";

const productTypeDef = gql`
  type Query {
    getProducts: [Products]
  }

  type Mutation {
    addProduct(payload: AddProductInput!): AddProductMutOutput
    productCheckout(payload: ProductCheckoutType!): ProductCheckoutOut
  }

  # Beginning of  QUE/MUT Fields

  input AddProductInput {
    name: String!
    category: ProductCategory!
    price: Int!
    availableForRent: Boolean!
    rentingPrice: Int!
    quantity: Int!
    image: AddProductImage!
    description: String!
  }

  input AddProductImage {
    hash: String!
    url: String!
  }

  type AddProductMutOutput {
    success: Boolean
    msg: String!
  }

  input ProductCheckoutType {
    totalAmount: Int!
    productQty: [ProductCheckoutQtyType]
  }

  input ProductCheckoutQtyType {
    prodId: String!
    qty: Int!
    name: String!
  }

  type ProductCheckoutOut {
    success: Boolean!
  }

  enum ProductCategory {
    FARM_PRODUCE
    FARM_MACHINERY
  }

  #   End of QUE/MUT Fields

  type User {
    id: String
    email: String
    username: String
    fullname: String
    image: String
    role: Role
    deliveryAddress: [DeliveryAddress]
    transactions: [Transaction]
    products: [Products]
    wallet: Wallet
  }

  type Products {
    id: String
    userId: String
    name: String
    description: String
    quantity: Int
    price: Int
    currency: String
    type: String
    availableForRent: Boolean
    rentingPrice: Int
    image: ProductImage
    ratings: [ProductsRating]
    user: User
  }

  type ProductImage {
    id: String
    hash: String
    url: String
    product: Products
  }

  type ProductsRating {
    id: String
    userId: String
    rate: Int
    product: Products
    user: User
  }
`;

export default productTypeDef;
