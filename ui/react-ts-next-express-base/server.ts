/* eslint-disable no-console */
import express from 'express';
import next from 'next';
import pino from 'express-pino-logger';
// port
const port: string | number = process.env.PORT || 3000;
// environment
const dev: boolean = process.env.NODE_ENV !== 'production';
// create next.js app
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});
// app startup function
const start = async (app: any) => {
  try {
    // next.js handler
    const handle = app.getRequestHandler();
    // declare express server
    let server: any;
    // prepare next.js app
    await app.prepare();
    // instantiate express server
    server = express();
    // middleware
    server.use(pino({ prettyPrint: true }));
    // import and use api routes (express)
    const routers: Array<string> = ['/api'];
    await (async (routers) => {
      for (const route of routers) {
        console.log(`Adding router to application: "${route}"`);
        const { default: router } = await import(`.${route}`);
        server.use(route, router);
      }
    })(routers);
    // ssr routes (next app)
    server.all('*', (req: express.Request, res: express.Response) => handle(req, res));
    // listen
    server.listen(port, (err: Error) => {
      if (err) throw err;
      console.log(`Custom Next.js server running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// start
start(app);
