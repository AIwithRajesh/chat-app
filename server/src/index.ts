import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { server } from "./graphql/index.js";

const PORT = process.env.PORT || 8000;
const io = new Server({});

io.on("connection", (socket) => {
  console.log(socket);
});

const app = express();

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
