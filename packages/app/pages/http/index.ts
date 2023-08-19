import gql from "graphql-tag";

export const AddRoleToCache = gql`
  mutation AddRoleToCache($role: String!) {
    # add user role to cache b4 signup
    addRoleToCache(role: $role) {
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
