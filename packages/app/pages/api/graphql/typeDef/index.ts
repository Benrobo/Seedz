import gql from "graphql-tag";
import userTypeDef from "./user.type";
import paymentTypeDef from "./payment.type";
import productTypeDef from "./product.type";
import seedzAiTypeDef from "./assistant.type";

const combinedTypeDef = gql`
  ${userTypeDef}
  ${paymentTypeDef}
  ${productTypeDef}
  ${seedzAiTypeDef}
`;

export default combinedTypeDef;
