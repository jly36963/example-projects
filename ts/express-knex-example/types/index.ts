import {z} from 'zod';
import {Router} from 'express';

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
      ninjaId: string
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

export type routerFactory = (providers: Providers) => Router;

// ---
// Database & API
// ---

type Nullable<T> = T | null;

export interface Ninja {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: string;
  updatedAt: Nullable<string>;
}

export interface NinjaWithJutsus extends Ninja {
  jutsus: Array<Jutsu>;
}

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

export interface Jutsu {
  id: string;
  name: string;
  chakraNature: string;
  description: string;
  createdAt: string;
  updatedAt: Nullable<string>;
}

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

export interface JutsuWithNinjas extends Jutsu {
  ninjas: Array<Ninja>;
}

// export interface Ninja {
//   id: string;
//   firstName: string;
//   lastName: string;
//   age: number;
//   createdAt: string;
//   updatedAt: string | null;
//   jutsus?: Array<Jutsu>;
// }

// export interface Jutsu {
//   id: string;
//   name: string;
//   chakraNature: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string | null;
//   ninjas?: Array<Ninja>;
// }
