// package imports
import express from 'express';
// router imports
import index from './routes/api/index';

// app instance
const app = express();
// use routers
app.use('/', index);

// export app
export default app;
