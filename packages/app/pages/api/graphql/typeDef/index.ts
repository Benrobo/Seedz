import gql from "graphql-tag";
import userTypeDef from "./user.type";
import paymentTypeDef from "./payment.type";

const combinedTypeDef = gql`
  ${userTypeDef}
  ${paymentTypeDef}
`;

export default combinedTypeDef;
