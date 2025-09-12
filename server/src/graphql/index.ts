import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./modules/user/typeDefs.ts";
import { resolvers } from "./modules/user/resolvers.ts";

export const gqlserver = new ApolloServer({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
});

await gqlserver.start();
