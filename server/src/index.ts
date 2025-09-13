import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import { gqlserver } from "./graphql/index.ts";
import http from "http";
import { initSocket } from "./socket/socket.ts";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cookieParser());

const httpServer = http.createServer(app);

const io = initSocket(httpServer);

interface MyContext {
  token?: string;
}
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // allow cookies
  }),
  express.json(),
  expressMiddleware(gqlserver, {
    context: async ({ req, res }): Promise<MyContext & { res: any }> => {
      return {
        token: req.headers.token as string,
        res, // <-- pass the response object
      };
    },
  })
);

httpServer.listen(PORT, () => {
  console.log("app is running on port ", PORT);
});
