import { ZodError } from "zod";
import { Hono, type Context } from "hono";
import { checkUuid } from "../../utils/index.js";
import { NinjaInputSchema, NinjaUpdatesSchema } from "../../types/index.js";
import type { routerFactory } from "../../types/index.js";


const createRouter: routerFactory = (providers) => {
	const { pgDal } = providers;
	const router = new Hono();

	/** Get ninja by id */
	router.get("/:id", async (ctx) => {
		const { id } = ctx.req.param();
		try {
			checkUuid(id);
			const ninja = await pgDal.ninjas.get(id);
			if (!ninja) {
				return ctx.body(undefined, 404);
			}
			return ctx.json(ninja);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Insert new ninja */
	router.post("/", async (ctx) => {
		const input = await ctx.req.json();
		try {
			const ninjaInput = NinjaInputSchema.parse(input);
			const ninja = await pgDal.ninjas.insert(ninjaInput);
			console.log(ninja); // DELETE ME
			return ctx.json(ninja);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Update ninja */
	router.put("/:id", async (ctx) => {
		const { id } = ctx.req.param();
		const updates = await ctx.req.json();

		try {
			checkUuid(id);
			const existingNinja = await pgDal.ninjas.get(id);
			if (!existingNinja) {
				return ctx.body(undefined, 404);
			}
			const ninjaUpdates = NinjaUpdatesSchema.parse(updates);
			const ninja = await pgDal.ninjas.update(id, ninjaUpdates);
			return ctx.json(ninja);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Delete ninja */
	router.delete("/:id", async (ctx) => {
		const { id } = ctx.req.param();
		try {
			checkUuid(id);
			const existingNinja = await pgDal.ninjas.get(id);
			if (!existingNinja) {
				return ctx.body(undefined, 404);
			}
			const ninja = await pgDal.ninjas.del(id);
			return ctx.json(ninja);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Associate ninja & jutsu */
	router.post("/:ninjaId/jutsu/:jutsuId", async (ctx) => {
		const { ninjaId, jutsuId } = ctx.req.param();
		try {
			checkUuid(ninjaId);
			checkUuid(jutsuId);
			await pgDal.ninjas.associateJutsu(ninjaId, jutsuId);
			return ctx.body(undefined, 204);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Disassociate ninja & jutsu */
	router.delete("/:ninjaId/jutsu/:jutsuId", async (ctx) => {
		const { ninjaId, jutsuId } = ctx.req.param();
		try {
			await pgDal.ninjas.disassociateJutsu(ninjaId, jutsuId);
			return ctx.body(undefined, 204);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Get ninja with jutsus */
	router.get("/:id/jutsus", async (ctx) => {
		const { id } = ctx.req.param();
		try {
			checkUuid(id);
			const ninjaWithJutsus = await pgDal.ninjas.getNinjaWithJutsus(id);
			if (!ninjaWithJutsus) {
				return ctx.body(undefined, 404);
			}
			return ctx.json(ninjaWithJutsus);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	return router;
};

export default createRouter;
