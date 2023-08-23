import { ApolloError } from "@apollo/client";
import toast from "react-hot-toast";

// handle all http Apollo request errors
function handleApolloHttpErrors(error: ApolloError) {
  // graphql error
  const networkError = error.networkError as any;
  const errorObj = networkError?.result?.errors[0] ?? error.graphQLErrors[0];

  toast.error(errorObj?.message);

  //   if (errorObj?.code === "GQL_SERVER_ERROR") {
  //   }
  console.log(JSON.stringify(error, null, 2));
  return errorObj?.message;
}

export default handleApolloHttpErrors;
