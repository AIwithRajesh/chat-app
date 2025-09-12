import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String!
    getUserToken(email: String!, password: String!): String
  }
  type Mutation {
    _: Boolean
  }
  type User {
    firstName: String!
    lastName: String!
    username: String!
    phoneNumber: String!
    email: String!
    passwordHash: String!
  }
  extend type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      username: String!
      phoneNumber: String!
      email: String!
      passwordHash: String!
    ): String!
  }
`;
