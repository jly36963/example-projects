// imports
import express from 'express';
import {ZodError} from 'zod';
import {checkUuid} from '../../utils/index.js';
import {JutsuInputSchema, JutsuUpdatesSchema} from '../../types/index.js';
import type {routerFactory} from '../../types/index.js';

const createRouter: routerFactory = (providers) => {
  const {pgDal} = providers;

  const router = express.Router();

  /** Get jutsu by id */
  router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      checkUuid(id)
      const jutsu = await pgDal.jutsus.get(id);
      if (!jutsu) {
        return res.sendStatus(404);
      }
      return res.status(200).json(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400)
      }
      return res.sendStatus(500);
    }
  });

  /** Insert new jutsu */
  router.post('/', async (req, res) => {
    const jutsuInput = req.body
    try {
      const parsedJutsuInput = JutsuInputSchema.parse(jutsuInput);
      const jutsu = await pgDal.jutsus.insert(parsedJutsuInput);
      if (!jutsu) throw new Error();
      return res.status(200).json(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400)
      }
      return res.sendStatus(500);
    }
  });

  /** Update jutsu */
  router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const jutsuInput = req.body
    try {
      checkUuid(id)
      const parsedJutsuInput = JutsuUpdatesSchema.parse(jutsuInput);
      const jutsu = await pgDal.jutsus.update(id, parsedJutsuInput);
      if (!jutsu) throw new Error();
      return res.status(200).json(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400)
      }
      return res.sendStatus(500);
    }
  });

  /** Delete jutsu */
  router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      checkUuid(id)
      const jutsu = await pgDal.jutsus.del(id);
      if (!jutsu) throw new Error();
      return res.status(200).json(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400)
      }
      return res.sendStatus(500);
    }
  });

  return router;
};

export default createRouter;
