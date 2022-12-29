// ---
// Ninja
// ---

export interface Ninja {
  id: number;
  first_name: string;
  last_name: string;
  known_jutsu?: Array<Jutsu>;
}

export interface NinjaNew {
  first_name: string;
  last_name: string;
}

export interface NinjaUpdates {
  first_name?: string;
  last_name?: string;
}

// Ninja (graphql input)

export interface NinjaInsertArgs {
  ninja: NinjaNew;
}

export interface NinjaUpdateArgs {
  id: number;
  updates: NinjaUpdates;
}

export interface NinjaDeleteArgs {
  id: number;
}

// ---
// Jutsu
// ---

export interface Jutsu {
  id: number;
  name: string;
  chakra_nature: string;
  description: string;
}

export interface JutsuNew {
  name: string;
  chakra_nature: string;
  description: string;
}

export interface JutsuUpdates {
  name?: string;
  chakra_nature?: string;
  description?: string;
}

export interface JutsuUpdateArgs {
  id: number;
  updates: JutsuUpdates;
}

// Jutsu (graphql input)

export interface JutsuInsertArgs {
  jutsu: JutsuNew;
}

export interface JutsuUpdateArgs {
  id: number;
  updates: JutsuUpdates;
}

export interface JutsuDeleteArgs {
  id: number;
}
