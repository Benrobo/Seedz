import gql from "graphql-tag";

export const UpdateUserRole = gql`
  mutation UserMutation($role: Role!) {
    updateUserRole(role: $role) {
      success
    }
  }
`;

export const FundWallet = gql`
  mutation PaymentMutation($amount: String!, $currency: String!) {
    fundWallet(amount: $amount, currency: $currency) {
      access_code
      authorization_url
      reference
    }
  }
`;

export const GetUserInfo = gql`
  query UserQuery($userId: String!) {
    getUser(id: $userId) {
      email
      username
      fullname
      role
      image
      wallet {
        balance
        currency
      }
    }
  }
`;

export const AddProduct = gql`
  mutation ProductMutation($productPayload: AddProductInput!) {
    addProduct(payload: $productPayload) {
      msg
      success
    }
  }
`;

export const GetAllProducts = gql`
  query ProductQuery {
    getProducts {
      id
      name
      price
      availableForRent
      rentingPrice
      quantity
      description
      image {
        url
        hash
      }
      user {
        id
        fullname
        role
      }
    }
  }
`;

export const ProductCheckout = gql`
  mutation ProductCheckout($productCheckoutPayload: ProductCheckoutType!) {
    productCheckout(payload: $productCheckoutPayload) {
      success
    }
  }
`;

export const SeedzAssistant = gql`
  mutation SeedzAiMutation($AiInput: AiInput!) {
    askSeedzAi(payload: $AiInput) {
      answer
      lang
      success
    }
  }
`;

export const DeleteProduct = gql`
  mutation ProductDelete($prodId: String!) {
    deleteProduct(prodId: $prodId) {
      success
    }
  }
`;

// just to prevent error during build process.
export default function f() {}
