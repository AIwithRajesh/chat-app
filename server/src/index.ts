import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

interface MyContext {
  token?: string;
}
const PORT = process.env.PORT || 8000;
const io = new Server({});

io.on("connection", (socket) => {
  console.log(socket);
});

const app = express();

const server = new ApolloServer<MyContext>({
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

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

app.listen(PORT, () => {
  console.log("app is running on port ", PORT);
});
