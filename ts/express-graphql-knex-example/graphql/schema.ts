import path from 'node:path';
import url from 'node:url';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';
import {loadFiles} from '@graphql-tools/load-files';
import {makeExecutableSchema} from '@graphql-tools/schema';
import type {GraphQLSchema} from 'graphql';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/** Merge all schema/resolver files and return GraphQLSchema */
export async function getSchema(): Promise<GraphQLSchema> {
  const typeDefs = mergeTypeDefs(
    await loadFiles(path.join(__dirname, './*/**/schema.gql'))
  );
  const resolvers = mergeResolvers(
    await loadFiles(path.join(__dirname, './*/**/resolvers.{ts,js}'))
  );

  const schema = makeExecutableSchema({typeDefs, resolvers});
  return schema;
}
