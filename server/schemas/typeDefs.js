const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Issue {
    _id: ID
    title: String
    description: String
    status: String
    assignedTo: User
    author: User
    day: String
  }

  type Team {
    _id: ID
    name: String
    code: String
    issues: [Issue]
  }

  type User {
    _id: ID
    name: String
    useName: String
    email: String
    designation: String
    team: Team
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    issues: [Issue]
    users: [User]
    user: User
    team: Team
  }

  type Mutation {
    updateStatus(_id: ID!, status: String!): Issue
    updateAssignedTo(_id: ID!, assignedTo: String!): Issue
    addUser(
      name: String!
      email: String!
      password: String!
      userName: String!
      designation: String!
      code: String
    ): Auth
    login(email: String!, password: String!): Auth
    addTeam(name: String!, code: String): Team
    addIssue(
      title: String!
      description: String
      status: String
      assignedTo: String
    ): Issue
  }
`;
module.exports = typeDefs;
