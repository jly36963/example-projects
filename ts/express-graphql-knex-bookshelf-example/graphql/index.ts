// express
import express from "express";
// graphql
import { graphqlHTTP } from "express-graphql";
import context from "./context";
import schema from "./schema";

const router = express.Router();

const dev = process.env.NODE_ENV !== "production";

router.post(
  "/",
  graphqlHTTP({
    schema,
    context,
    graphiql: false,
  }),
);
router.get(
  "/",
  graphqlHTTP({
    schema,
    context,
    graphiql: dev,
  }),
);

export default router;
