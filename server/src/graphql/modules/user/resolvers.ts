import { mutation } from "./mutations.ts";
import { queries } from "./queries.ts";

export const resolvers = {
  Query: queries.Query,
  Mutation: mutation.Mutation,
};
