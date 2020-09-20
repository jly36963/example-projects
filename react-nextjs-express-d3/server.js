/* eslint-disable no-console */
const express = require("express");
const next = require("next");
// port
const port = process.env.PORT || 3000;
// environment
const dev = process.env.NODE_ENV !== "production";

// create next.js app
const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev,
});

// next.js handler
const handle = app.getRequestHandler();
// declare express server
let server;
// prepare next.js app
app
  .prepare()
  .then(() => {
    // instantiate express server
    server = express();
    // add express routes
    server.use("/api", require("./api/index"));
    // catch all other routes with next.js handler
    server.all("*", (req, res) => handle(req, res));
    // listen
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Custom Next.js server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
