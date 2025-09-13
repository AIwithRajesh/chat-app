import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import { gqlserver } from "./graphql/index.ts";
import http from "http";
import { initSocket } from "./socket/socket.ts";
import cookieParser from "cookie-parser";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "@JWT_TOKEN";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cookieParser());

const httpServer = http.createServer(app);

const io = initSocket(httpServer);

interface MyContext {
  token?: string;
  userId: any;
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
      const token = req.cookies.token as string;
      console.log("token", token);
      let userId = null;

      if (token) {
        try {
          const payload = JWT.verify(token, JWT_SECRET) as { id: number };
          userId = payload.id;
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }

      console.log("Cookies:", req.cookies); // Should show token here
      console.log("Token:", token, "UserId:", userId);

      return { token, userId, res };
      // return {
      //   token: req.cookies.token as string,
      //   res, // <-- pass the response object
      // };
    },
  })
);

httpServer.listen(PORT, () => {
  console.log("app is running on port ", PORT);
});
