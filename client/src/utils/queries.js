import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
  {
    users {
      _id
      name
    }
  }
`;

export const QUERY_TEAMS = gql`
  {
    team {
      _id
      name
      code
      issues {
        _id
        title
        description
        status
        assignedTo {
          _id
          name
        }
        author {
          _id
          name
        }
        day
      }
    }
  }
`;
