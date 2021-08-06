const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Issue {
    _id: ID
    title: String
    description: String
    status: String
    assignedTo: User
    author: User
  }

  type Team {
    _id: ID
    name: String
    code: Int
    issues: [Issue]
  }

  type User {
    _id: ID
    name: String
    useName: String
    email: String
    team: Team
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    issues: [Issue]
    user: User
    team: Team
  }

  type Mutation {
    addUser(
      name: String!
      email: String!
      password: String!
      userName: String!
      code: Int
    ): Auth
    login(email: String!, password: String!): Auth
    addTeam(name: String!, code: Int): Team
  }
`;
module.exports = typeDefs;
