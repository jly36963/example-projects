import { oak, pick } from "../../deps.ts";
import { CreateRouter, NinjaNew, NinjaUpdates } from "../../types/mod.ts";

const createRouter: CreateRouter = (providers) => {
  const { pgdal } = providers;

  const router = new oak.Router({ prefix: "/api/ninja" });

  /** Get ninja by id */
  router.get("/:id", async (c) => {
    const { id } = c.params;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      const ninja = await pgdal.ninjas.get(id);
      if (!ninja) {
        c.response.status = 404;
        return;
      }
      c.response.status = 200;
      c.response.body = ninja;
    } catch {
      c.response.status = 500;
    }
  });

  /** Insert new ninja */
  router.post("/", async (c) => {
    const body = c.request.body();
    if (body.type !== "json") {
      c.response.status = 400;
      return;
    }
    const ninjaNew: NinjaNew = pick(await body.value, [
      "firstName",
      "lastName",
      "age",
    ]);

    try {
      const ninja = await pgdal.ninjas.insert(ninjaNew);
      if (!ninja) throw new Error();
      c.response.status = 200;
      c.response.body = ninja;
    } catch {
      c.response.status = 500;
    }
  });

  /** Update existing ninja */
  router.put("/:id", async (c) => {
    const id = c.params?.id;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }

    const body = c.request.body();
    if (body.type !== "json") {
      c.response.status = 400;
      return;
    }
    const ninjaUpdates: NinjaUpdates = pick(await body.value, [
      "firstName",
      "lastName",
      "age",
    ]);

    try {
      const ninja = await pgdal.ninjas.update(id, ninjaUpdates);
      if (!ninja) throw new Error();
      c.response.status = 200;
      c.response.body = ninja;
    } catch {
      c.response.status = 500;
    }
  });

  /** Delete existing ninja */
  router.delete("/:id", async (c) => {
    const { id } = c.params;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      const ninja = await pgdal.ninjas.del(id);
      if (!ninja) throw new Error();
      c.response.status = 200;
      c.response.body = ninja;
    } catch {
      c.response.status = 500;
    }
  });

  /** Associate ninja & jutsu */
  router.post("/:ninjaId/jutsu/:jutsuId", async (c) => {
    const { ninjaId, jutsuId } = c.params;
    if (typeof ninjaId !== "string" || typeof jutsuId !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      await pgdal.ninjas.associateJutsu(ninjaId, jutsuId);
      c.response.status = 204;
    } catch {
      c.response.status = 500;
    }
  });

  /** Dissociate ninja & jutsu */
  router.delete("/:ninjaId/jutsu/:jutsuId", async (c) => {
    const { ninjaId, jutsuId } = c.params;
    if (typeof ninjaId !== "string" || typeof jutsuId !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      await pgdal.ninjas.disassociateJutsu(ninjaId, jutsuId);
      c.response.status = 204;
      return;
    } catch {
      c.response.status = 500;
      return;
    }
  });

  /** Get ninja with jutsus */
  router.get("/:id/jutsus", async (c) => {
    const { id } = c.params;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      const ninjaWithJutsus = await pgdal.ninjas.getNinjaWithJutsus(id);
      if (!ninjaWithJutsus) {
        c.response.status = 404;
        return;
      }
      c.response.status = 200;
      c.response.body = ninjaWithJutsus;
    } catch {
      c.response.status = 500;
    }
  });

  return router;
};

export default createRouter;
