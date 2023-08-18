import gql from "graphql-tag";
import userTypeDef from "./user.type";
import paymentTypeDef from "./payment.res";

const combinedTypeDef = gql`
  ${userTypeDef}
  ${paymentTypeDef}
`;

export default combinedTypeDef;
