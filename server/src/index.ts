import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import { gqlserver } from "./graphql/index.ts";
import http from "http";
import { initSocket } from "./socket/socket.ts";

const PORT = process.env.PORT || 8080;

const app = express();

const httpServer = http.createServer(app);

const io = initSocket(httpServer);
// console.log("io", io);

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(gqlserver, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

httpServer.listen(PORT, () => {
  console.log("app is running on port ", PORT);
});
