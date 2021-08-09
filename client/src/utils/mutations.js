import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $name: String!
    $userName: String!
    $email: String!
    $password: String!
    $code: String
    $designation: String!
  ) {
    addUser(
      name: $name
      userName: $userName
      email: $email
      password: $password
      code: $code
      designation: $designation
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_ISSUE = gql`
  mutation addIssue(
    $title: String!
    $description: String
    $status: String
    $assignedTo: String
  ) {
    addIssue(
      title: $title
      description: $description
      status: $status
      assignedTo: $assignedTo
    ) {
      _id
      title
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation updateStatus($_id: ID!, $status: String!) {
    updateStatus(_id: $_id, status: $status) {
      _id
    }
  }
`;

export const UPDATE_ASSIGNEDTO = gql`
  mutation updateAssignedTo($_id: ID!, $assignedTo: String!) {
    updateAssignedTo(_id: $_id, assignedTo: $assignedTo) {
      _id
    }
  }
`;
