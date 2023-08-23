import gql from "graphql-tag";

const seedzAiTypeDef = gql`
  type Mutation {
    askSeedzAi(payload: AiInput!): AiOutput!
  }

  input AiInput {
    question: String!
    lang: String!
  }

  type AiOutput {
    answer: [String]!
    lang: String!
    success: Boolean!
  }
`;

export default seedzAiTypeDef;
