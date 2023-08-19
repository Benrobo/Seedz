import gql from "graphql-tag";

export const AddRoleToCache = gql`
  mutation AddRoleToCache($role: String!) {
    # add user role to cache b4 signup
    addRoleToCache(role: $role) {
      success
    }
  }
`;
