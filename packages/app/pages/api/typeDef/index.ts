import gql from "graphql-tag";
import userTypeDef from "./user.type";

const combinedTypeDef = gql`
  ${userTypeDef}
`;

export default combinedTypeDef;
