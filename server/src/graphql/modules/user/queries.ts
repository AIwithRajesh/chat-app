import { gql } from "graphql-tag";
import UserService from "../../../services/user.ts";

export const queries = {
  Query: {
    hello: () => "Hello GraphQL 🚀",
    getUserToken: async (
      _: any,
      payload: { email: string; password: string }
    ) => {
      const token = await UserService.getUserToken(payload);

      return token;
    },
  },
};
