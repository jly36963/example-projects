// imports
import express from 'express';
import { pick } from 'lodash-es';
import { Providers } from '../../dal/providers';

const createRouter = (providers: Providers): express.Router => {
  const { pgdal } = providers;

  const router = express.Router();

  // Get ninja by id
  router.get('/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.sendStatus(400);
    }
    try {
      const ninja = await pgdal.ninjas.get(id);
      if (!ninja) {
        return res.sendStatus(404);
      }
      return res.status(200).json(ninja);
    } catch {
      return res.sendStatus(500);
    }
  });

  // Insert new ninja
  router.post('/', async (req: express.Request, res: express.Response) => {
    const ninjaNew = pick(req.body, ['firstName', 'lastName', 'age']);
    try {
      const ninja = await pgdal.ninjas.insert(ninjaNew);
      if (!ninja) throw new Error();
      return res.status(200).json(ninja);
    } catch {
      return res.sendStatus(500);
    }
  });

  // update
  router.put('/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const ninjaUpdates = pick(req.body, ['firstName', 'lastName', 'age']);
    if (typeof id !== 'string') {
      return res.sendStatus(400);
    }
    try {
      const ninja = await pgdal.ninjas.update(id, ninjaUpdates);
      if (!ninja) throw new Error();
      return res.status(200).json(ninja);
    } catch {
      return res.sendStatus(500);
    }
  });

  // delete
  router.delete('/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.sendStatus(400);
    }
    try {
      const ninja = await pgdal.ninjas.del(id);
      if (!ninja) throw new Error();
      return res.status(200).json(ninja);
    } catch {
      return res.sendStatus(500);
    }
  });

  // associate ninja & jutsu
  router.post(
    '/:ninjaId/jutsu/:jutsuId',
    async (req: express.Request, res: express.Response) => {
      const { ninjaId, jutsuId } = req.params;
      if (typeof ninjaId !== 'string' || typeof jutsuId !== 'string') {
        return res.sendStatus(400);
      }
      try {
        await pgdal.ninjas.associateJutsu(ninjaId, jutsuId);
        return res.sendStatus(204);
      } catch {
        return res.sendStatus(500);
      }
    },
  );

  // disassociate ninja & jutsu
  router.delete(
    '/:ninjaId/jutsu/:jutsuId',
    async (req: express.Request, res: express.Response) => {
      const { ninjaId, jutsuId } = req.params;
      if (typeof ninjaId !== 'string' || typeof jutsuId !== 'string') {
        return res.sendStatus(400);
      }
      try {
        await pgdal.ninjas.disassociateJutsu(ninjaId, jutsuId);
        return res.sendStatus(204);
      } catch {
        return res.sendStatus(500);
      }
    },
  );

  // get ninja with jutsus
  router.get(
    '/:id/jutsus',
    async (req: express.Request, res: express.Response) => {
      const { id } = req.params;
      if (typeof id !== 'string') {
        return res.sendStatus(400);
      }
      try {
        const ninjaWithJutus = await pgdal.ninjas.getNinjaWithJutsus(id);
        if (!ninjaWithJutus) {
          return res.sendStatus(404);
        }
        return res.status(200).json(ninjaWithJutus);
      } catch {
        return res.sendStatus(500);
      }
    },
  );

  return router;
};

export default createRouter;
