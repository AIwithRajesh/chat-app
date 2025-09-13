import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./modules/user/typeDefs.ts";
import { resolvers } from "./modules/user/resolvers.ts";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

export const gqlserver = new ApolloServer({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      footer: false,
    }),
  ],
});

await gqlserver.start();
