// dotenv
require("dotenv").config();
// imports
import path from "path";
import express from "express";
import pino from "express-pino-logger";
// graphql
import graphqlRouter from "./graphql";
// instantiate app
const app = express();
// server startup function
const start = async (app: any) => {
  // middleware
  app.use(express.json()).use(pino({ prettyPrint: true }));
  // dynamically import & use api routes
  // (router file location should correlate to url path)
  const routes: Array<string> = ["/api"];
  await (async () => {
    for (const route of routes) {
      console.log(`Adding router to application: "${route}"`);
      import(`./api/routes/${route}`).then((router) => app.use(route, router.default));
    }
  })();
  // graphql
  app.use("/graphql", graphqlRouter);
  // static files (public)
  app.use(express.static("public"));
  // Serve static assets in production (post-build react app)
  if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
  // port
  const port: string = process.env.PORT || "5000";
  // listen
  app.listen(port, (): void => console.log(`App listening at http://localhost:${port}`));
};

start(app);

// graphiql does not work with helmet on
// https://github.com/contrawork/graphql-helix/issues/4

// import helmet from "helmet";
// app.use(helmet())
