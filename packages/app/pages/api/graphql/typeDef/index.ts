import gql from "graphql-tag";
import userTypeDef from "./user.type";
import paymentTypeDef from "./payment.type";
import productTypeDef from "./product.type";

const combinedTypeDef = gql`
  ${userTypeDef}
  ${paymentTypeDef}
  ${productTypeDef}
`;

export default combinedTypeDef;
