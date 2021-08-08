import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
  {
    users {
      _id
      name
    }
  }
`;