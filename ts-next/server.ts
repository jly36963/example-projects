/* eslint-disable no-console */
import express from 'express';
import next from 'next';
import apiRoutes from './api/index';
// port
const port: string | number = process.env.PORT || 3000;
// environment
const dev: boolean = process.env.NODE_ENV !== 'production';

// create next.js app
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});

// next.js handler
const handle = app.getRequestHandler();
// declare express server
let server: any;
// prepare next.js app
app
  .prepare()
  .then(() => {
    // instantiate express server
    server = express();
    // add express routes
    server.use('/api', apiRoutes);
    // catch all other routes with next.js handler
    server.all('*', (req: express.Request, res: express.Response) => handle(req, res));
    // listen
    server.listen(port, (err: Error) => {
      if (err) throw err;
      console.log(`Custom Next.js server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
