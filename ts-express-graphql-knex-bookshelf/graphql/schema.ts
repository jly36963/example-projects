import path from "path";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./*/**/schema.gql"))
);
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./*/**/resolvers.{ts,js}"))
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
