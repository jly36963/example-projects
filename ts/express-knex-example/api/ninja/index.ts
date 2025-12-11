import express from 'express';
import {ZodError} from 'zod';
import {checkUuid} from '../../utils/index.js';
import {NinjaInputSchema, NinjaUpdatesSchema} from '../../types/index.js';
import type {routerFactory} from '../../types/index.js';

const createRouter: routerFactory = providers => {
  const {pgDal} = providers;
  const router = express.Router();

  /** Get ninja by id */
  router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      checkUuid(id);
      const ninja = await pgDal.ninjas.get(id);
      if (!ninja) {
        return res.sendStatus(404);
      }
      return res.status(200).json(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  /** Insert new ninja */
  router.post('/', async (req, res) => {
    const ninjaInput = req.body;
    try {
      const parsedNinjaInput = NinjaInputSchema.parse(ninjaInput);
      const ninja = await pgDal.ninjas.insert(parsedNinjaInput);
      if (!ninja) throw new Error();
      return res.status(200).json(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  /** Update existing ninja */
  router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const ninjaUpdates = req.body;
    try {
      checkUuid(id);
      const parsedNinjaUpdates = NinjaUpdatesSchema.parse(ninjaUpdates);
      const ninja = await pgDal.ninjas.update(id, parsedNinjaUpdates);
      if (!ninja) throw new Error();
      return res.status(200).json(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  /** Delete ninja by id */
  router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      checkUuid(id);
      const ninja = await pgDal.ninjas.del(id);
      if (!ninja) throw new Error();
      return res.status(200).json(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  /** Associate ninja and jutsu */
  router.post('/:ninjaId/jutsu/:jutsuId', async (req, res) => {
    const {ninjaId, jutsuId} = req.params;
    try {
      checkUuid(ninjaId);
      checkUuid(jutsuId);
      await pgDal.ninjas.associateJutsu(ninjaId, jutsuId);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  /** Disassociate ninja and jutsu */
  router.delete('/:ninjaId/jutsu/:jutsuId', async (req, res) => {
    const {ninjaId, jutsuId} = req.params;
    try {
      checkUuid(ninjaId);
      checkUuid(jutsuId);
      await pgDal.ninjas.disassociateJutsu(ninjaId, jutsuId);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  /** Get ninja with jutsus */
  router.get('/:id/jutsus', async (req, res) => {
    const {id} = req.params;
    try {
      checkUuid(id);
      const ninjaWithJutus = await pgDal.ninjas.getNinjaWithJutsus(id);
      if (!ninjaWithJutus) {
        return res.sendStatus(404);
      }
      return res.status(200).json(ninjaWithJutus);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  });

  return router;
};

export default createRouter;
