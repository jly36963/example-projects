import express from 'express';
import type {routerFactory} from '../types/index.js';

const createRouter: routerFactory = providers => {
  const router = express.Router();

  router.get('/', (_req, res) => {
    return res.sendStatus(200);
  });

  return router;
};

export default createRouter;
