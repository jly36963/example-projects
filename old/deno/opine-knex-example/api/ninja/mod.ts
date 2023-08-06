import { pick, Router } from "../../deps.ts";
import { CreateRouter, NinjaNew, NinjaUpdates } from "../../types/mod.ts";

const createRouter: CreateRouter = (providers) => {
  const { pgdal } = providers;
  const router = Router();

  /** Get ninja by id */
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const ninja = await pgdal.ninjas.get(id);
      if (!ninja) {
        res.sendStatus(404);
        return;
      }
      res.json(ninja);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Insert new ninja */
  router.post("/", async (req, res) => {
    const ninjaNew: NinjaNew = pick(req.body, [
      "firstName",
      "lastName",
      "age",
    ]);

    try {
      const ninja = await pgdal.ninjas.insert(ninjaNew);
      if (!ninja) throw new Error();
      res.json(ninja);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Update existing ninja */
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const ninjaUpdates: NinjaUpdates = pick(req.body, [
      "firstName",
      "lastName",
      "age",
    ]);

    try {
      const ninja = await pgdal.ninjas.update(id, ninjaUpdates);
      if (!ninja) throw new Error();
      res.json(ninja);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Delete existing ninja */
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const ninja = await pgdal.ninjas.del(id);
      if (!ninja) throw new Error();
      res.json(ninja);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Associate ninja & jutsu */
  router.post("/:ninjaId/jutsu/:jutsuId", async (req, res) => {
    const { ninjaId, jutsuId } = req.params;
    try {
      await pgdal.ninjas.associateJutsu(ninjaId, jutsuId);
      res.sendStatus(204);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Dissociate ninja & jutsu */
  router.delete("/:ninjaId/jutsu/:jutsuId", async (req, res) => {
    const { ninjaId, jutsuId } = req.params;
    try {
      await pgdal.ninjas.disassociateJutsu(ninjaId, jutsuId);
      res.sendStatus(204);
      return;
    } catch {
      res.sendStatus(500);
      return;
    }
  });

  /** Get ninja with jutsus */
  router.get("/:id/jutsus", async (req, res) => {
    const { id } = req.params;
    try {
      const ninjaWithJutsus = await pgdal.ninjas.getNinjaWithJutsus(id);
      if (!ninjaWithJutsus) {
        res.sendStatus(404);
        return;
      }
      res.json(ninjaWithJutsus);
    } catch {
      res.sendStatus(500);
    }
  });

  return router;
};

export default createRouter;
