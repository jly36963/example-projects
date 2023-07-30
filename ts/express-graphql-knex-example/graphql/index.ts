import express from 'express';
import {createHandler} from 'graphql-http/lib/use/express';
import {getSchema} from './schema.js';
import {Providers, GqlContext} from '../types/index.js';

/** Set up graphql router */
export async function getGraphqlRouter(
  providers: Providers
): Promise<express.Router> {
  const router = express.Router();
  const context: GqlContext = {providers};

  const schema = await getSchema();

  router.post('/', createHandler({schema, context}));
  router.get('/', createHandler({schema, context}));

  return router;
}

// import {graphqlHTTP} from 'express-graphql';

// export function getGraphqlRouter({dev}: GraphqlRouterConfig): express.Router {
//   const router = express.Router();

//   router.post(
//     '/',
//     graphqlHTTP({
//       schema,
//       context,
//       graphiql: false,
//     })
//   );
//   router.get(
//     '/',
//     graphqlHTTP({
//       schema,
//       context,
//       graphiql: dev,
//     })
//   );

//   return router;
// }
