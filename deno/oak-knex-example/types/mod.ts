import { oak } from "../deps.ts";
import { Providers } from "../dal/providers.ts";

// ---
// Ninja
// ---

export interface Ninja {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: string;
  updatedAt: string | null;
  jutsus?: Array<Jutsu>;
}

/** User-provided values for creating a ninja */
export type NinjaNew = Pick<Ninja, "firstName" | "lastName" | "age">;

/** User-provided values for updating a ninja */
export type NinjaUpdates = NinjaNew;

// ---
// Jutsu
// ---

export interface Jutsu {
  id: string;
  name: string;
  chakraNature: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  ninjas?: Array<Ninja>;
}

/** User-provided values for creating a jutsu */
export type JutsuNew = Pick<Jutsu, "name" | "chakraNature" | "description">;

/** User-provided values for updating a jutsu */
export type JutsuUpdates = JutsuNew;

// ---
// Router
// ---

/** Function used to inject providers into an oak router's context at runtime */
export type CreateRouter = (providers: Providers) => oak.Router;
