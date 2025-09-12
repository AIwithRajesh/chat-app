import { ApolloServer } from "@apollo/server";

interface MyContext {
  token?: string;
}

export const server = new ApolloServer<MyContext>({
  typeDefs: `type Query {
    hello: String!
  }`,
  resolvers: {
    Query: {
      hello: () => "Hello GraphQL 🚀",
    },
  },
});
await server.start();
