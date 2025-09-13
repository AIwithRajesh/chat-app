import { gql } from "graphql-tag";

export const typeDefs = gql`
  type tokenResponse {
    message: String
    userId: String
    name: String
  }

  type Chat {
    id: ID!
    name: String
    isGroup: Boolean!
    createdAt: String!
    participants: [User!]!
    messages: [Message!]!
  }

  type Message {
    id: ID!
    chatId: ID!
    sender: User!
    content: String
    mediaUrl: String
    sentAt: String!
  }

  type UserList {
    id: Int!
    firstName: String!
    lastName: String!
    username: String!
    phoneNumber: String!
    email: String!
  }

  type Query {
    hello: String!
    getUserToken(email: String!, password: String!): tokenResponse
    getMessagesBetweenUsers(
      senderEmail: String!
      receiverEmail: String!
    ): [Message!]!
    getUserListWithConversation: [UserList!]!
  }

  type User {
    firstName: String!
    lastName: String!
    username: String!
    phoneNumber: String!
    email: String!
    passwordHash: String!
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      username: String!
      phoneNumber: String!
      email: String!
      passwordHash: String!
    ): String!

    sendDirectMessage(
      senderId: ID!
      receiverEmail: String!
      content: String!
      mediaUrl: String
    ): Message!
  }
`;
