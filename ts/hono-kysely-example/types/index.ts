import { z } from "zod";
import type { Hono } from "hono";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";

// ---
// Config
// ---

export const ServerConfigSchema = z
	.object({
		nodeEnv: z.string(),
		port: z.coerce.number().int(),
		pgUrl: z.string(),
	})
	.strict();

export type ServerConfig = z.infer<typeof ServerConfigSchema>;

// ---
// Providers
// ---

// Providers uses an interface that concrete/mock implementations share
// This makes unit testing easier

export interface Providers {
	pgDal: IPgDal;
}

export interface IPgDal {
	ninjas: {
		/** Get ninja by id */
		get: (id: string) => Promise<Ninja | undefined>;
		/** Insert new ninja */
		insert: (ninja: NinjaInput) => Promise<Ninja | undefined>;
		/** Update existing ninja */
		update: (id: string, updates: NinjaUpdates) => Promise<Ninja | undefined>;
		/** Delete ninja by id */
		del: (id: string) => Promise<Ninja | undefined>;
		/** Associate ninja and jutsu */
		associateJutsu: (ninjaId: string, jutsuId: string) => Promise<void>;
		/** Dissociate ninja and jutsu */
		disassociateJutsu: (ninjaId: string, jutsuId: string) => Promise<void>;
		/** Get ninja with jutsus */
		getNinjaWithJutsus: (
			ninjaId: string,
		) => Promise<NinjaWithJutsus | undefined>;
	};
	jutsus: {
		/** Get jutsu by id */
		get: (id: string) => Promise<Jutsu | undefined>;
		/** Insert new jutsu */
		insert: (jutsu: JutsuInput) => Promise<Jutsu | undefined>;
		/** Update existing jutsu */
		update: (id: string, updates: JutsuUpdates) => Promise<Jutsu | undefined>;
		/** Delete existing jutsu */
		del: (id: string) => Promise<Jutsu | undefined>;
	};
}

// ---
// Router
// ---

export type routerFactory = (providers: Providers) => Hono;

// ---
// Database & API
// ---

export const PgConfig = z.object({
	database: z.string(),
	host: z.string(),
	user: z.string(),
	password: z.string(),
	port: z.coerce.number().int(),
});

export const tables = {
	NINJAS: "ninjas",
	JUTSUS: "jutsus",
	NINJAS_JUTSUS: "ninjasJutsus",
} as const;

export interface Database {
	ninjas: NinjaTable;
	jutsus: JutsuTable;
	ninjasJutsus: NinjaJutsuTable;
}

export interface NinjaTable {
	id: Generated<string>;
	firstName: string;
	lastName: string;
	age: number;
	createdAt: Generated<string>;
	updatedAt: Generated<string | null>;
}

export type Ninja = Selectable<NinjaTable>;
export type NewNinja = Insertable<NinjaTable>;
export type NinjaUpdate = Updateable<NinjaTable>;

export interface NinjaWithJutsus extends Ninja {
	jutsus: Array<Jutsu>;
}

export interface JutsuTable {
	id: Generated<string>;
	name: string;
	chakraNature: string;
	description: string;
	createdAt: Generated<string>;
	updatedAt: Generated<string | null>;
}

export type Jutsu = Selectable<JutsuTable>;
export type NewJutsu = Insertable<JutsuTable>;
export type JutsuUpdate = Updateable<JutsuTable>;

export interface NinjaJutsuTable {
	ninjaId: string;
	jutsuId: string;
}

export type NewNinjaJutsu = Insertable<NinjaJutsuTable>;

// ---
// API
// ---

export const NinjaInputSchema = z
	.object({
		firstName: z.string(),
		lastName: z.string(),
		age: z.number().int(),
	})
	.strict();

export type NinjaInput = z.infer<typeof NinjaInputSchema>;
export const NinjaUpdatesSchema = NinjaInputSchema.partial();
export type NinjaUpdates = z.infer<typeof NinjaUpdatesSchema>;

export const JutsuInputSchema = z
	.object({
		name: z.string(),
		chakraNature: z.string(),
		description: z.string(),
	})
	.strict();

export type JutsuInput = z.infer<typeof JutsuInputSchema>;
export const JutsuUpdatesSchema = JutsuInputSchema.partial();
export type JutsuUpdates = z.infer<typeof JutsuUpdatesSchema>;
