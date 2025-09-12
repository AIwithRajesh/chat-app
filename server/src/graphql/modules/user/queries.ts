import { gql } from "graphql-tag";
import { AuthService } from "../../../services/authService.ts";
import type { Request, Response } from "express";

export const queries = {
  Query: {
    hello: () => "Hello GraphQL 🚀",
    getUserToken: async (
      _: any,
      payload: { email: string; password: string },
      context: { req: Request; res: Response }
    ) => {
      if (!context.res)
        throw new Error("Response object is missing in context");
      const token = await AuthService.getUserToken(payload, context.res);

      return token;
    },
  },
};
