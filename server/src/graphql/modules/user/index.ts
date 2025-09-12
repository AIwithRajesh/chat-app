import { resolvers } from "./resolvers.js";
import { mutation } from "./mutations.js";
import { queries } from "./queries.js";
import { typeDefs } from "./typeDefs.js";

export const User = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
